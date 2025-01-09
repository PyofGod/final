import Express from "express";
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Path,
  Post,
  Request,
  Route,
  Security,
  SuccessResponse,
} from "tsoa";

import HttpError from "../interfaces/http-error";
import HttpStatus from "../interfaces/http-status";
import * as dotenv from "dotenv";
dotenv.config();

const KEYCLOAK_URL = process.env.KEYCLOAK_URL; // กำหนด URL ของ Keycloak API
const REALM_NAME = process.env.REALM_NAME; // ชื่อ Realm ของ Keycloak

@Route("users")
export class UserController extends Controller {
  // Get all users
  // Get all users
  @Get()
  @Security("keycloak")
  public async getUsers(@Request() req: Express.Request) {
    const token = req.headers["authorization"]?.includes("Bearer ")
      ? req.headers["authorization"].split(" ")[1]
      : req.headers["authorization"];

    if (!token) {
      throw new HttpError(
        HttpStatus.UNAUTHORIZED,
        "ไม่พบข้อมูลสำหรับยืนยันตัวตน"
      );
    }

    try {
      // ดึงข้อมูล client express-client
      const clientResponse = await fetch(
        `${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/clients?clientId=express-client`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!clientResponse.ok) {
        throw new HttpError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          "ไม่สามารถดึงข้อมูล Client"
        );
      }

      const clients = await clientResponse.json();
      const client = clients.find(
        (c: { clientId: string }) => c.clientId === "express-client"
      );

      if (!client) {
        throw new HttpError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          "ไม่พบ Client 'express-client'"
        );
      }

      const clientId = client.id;

      // ดึงข้อมูลผู้ใช้ทั้งหมด
      const usersResponse = await fetch(
        `${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!usersResponse.ok) {
        throw new HttpError(
          HttpStatus.UNAUTHORIZED,
          "ไม่สามารถดึงข้อมูลผู้ใช้"
        );
      }

      const users = await usersResponse.json();

      // เพิ่ม roles ของแต่ละ user
      // ดึง roles ของแต่ละผู้ใช้และแปลงเป็นสตริง
      const usersWithRoles = await Promise.all(
        users.map(async (user: any) => {
          const rolesResponse = await fetch(
            `${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users/${user.id}/role-mappings/clients/${client.id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const roles = rolesResponse.ok ? await rolesResponse.json() : [];
          const roleNames = roles.map((role: any) => role.name);

          // แปลง roles เป็นสตริงเดียว (สมมติว่าผู้ใช้มี role เดียว)
          return {
            ...user,
            roles: roleNames.length > 0 ? roleNames[0] : null, // ส่ง role แรก (หรือ null ถ้าไม่มี)
          };
        })
      );

      return usersWithRoles;
    } catch (error) {
      console.error("Error fetching users with roles:", error);
      throw new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "เกิดข้อผิดพลาดในการเชื่อมต่อกับ Keycloak"
      );
    }
  }

  // Get user by username
  @Get("{username}")
  @Security("keycloak")
  public async getUserById(
    @Path() username: string,
    @Request() req: Express.Request
  ) {
    const token = req.headers["authorization"]?.includes("Bearer ")
      ? req.headers["authorization"].split(" ")[1]
      : req.headers["authorization"];

    if (!token) {
      throw new HttpError(
        HttpStatus.UNAUTHORIZED,
        "ไม่พบข้อมูลสำหรับยืนยันตัวตน"
      );
    }

    try {
      // ดึงข้อมูลผู้ใช้จาก Keycloak
      const userResponse = await fetch(
        `${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users?username=${username}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!userResponse.ok) {
        throw new HttpError(
          HttpStatus.UNAUTHORIZED,
          "ไม่สามารถดึงข้อมูลผู้ใช้"
        );
      }

      const users = await userResponse.json();
      const user = users[0]; // เนื่องจาก Keycloak API จะ return array

      if (!user) {
        throw new HttpError(HttpStatus.NOT_FOUND, "ไม่พบผู้ใช้ที่ระบุ");
      }

      // ดึงข้อมูล roles ของ user
      const rolesResponse = await fetch(
        `${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users/${user.id}/role-mappings/clients/express-client`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const roles = rolesResponse.ok ? await rolesResponse.json() : [];
      const roleNames = roles.map((role: any) => role.name);

      // เพิ่ม roles ในข้อมูลผู้ใช้
      return {
        ...user,
        roles: roleNames.length > 0 ? roleNames[0] : null, // ส่ง role เดียวเป็นสตริง
      };
    } catch (error) {
      console.error("Error fetching user with roles:", error);
      throw new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "เกิดข้อผิดพลาดในการเชื่อมต่อกับ Keycloak"
      );
    }
  }

  @Post()
  @Security("keycloak")
  @SuccessResponse("201", "Created")
  public async createUser(
    @Body()
    requestBody: {
      username?: string;
      email?: string;
      password?: string;
    },
    @Request() req: Express.Request
  ) {
    const token = req.headers["authorization"]?.includes("Bearer ")
      ? req.headers["authorization"].split(" ")[1]
      : req.headers["authorization"];

    if (!token) {
      throw new HttpError(
        HttpStatus.UNAUTHORIZED,
        "ไม่พบข้อมูลสำหรับยืนยันตัวตน"
      );
    }

    try {
      // สร้างผู้ใช้ใน Keycloak
      const createUserResponse = await fetch(
        `${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: requestBody.username,
            email: requestBody.email,
            enabled: true,
            credentials: [
              {
                temporary: false,
                type: "password",
                value: requestBody.password,
              },
            ],
          }),
        }
      );

      if (!createUserResponse.ok) {
        const errorDetails = await createUserResponse.text();
        console.error("Error creating user:", errorDetails);
        throw new HttpError(HttpStatus.BAD_REQUEST, "ไม่สามารถสร้างผู้ใช้");
      }

      // รับ ID ของผู้ใช้ที่สร้างใหม่
      const locationHeader = createUserResponse.headers.get("location");
      const userId = locationHeader?.split("/").pop();

      if (!userId) {
        throw new HttpError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          "ไม่สามารถดึง ID ของผู้ใช้ที่สร้างใหม่"
        );
      }

      // ดึงข้อมูล Client (express-client)
      const clientResponse = await fetch(
        `${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/clients?clientId=express-client`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!clientResponse.ok) {
        const errorDetails = await clientResponse.text();
        console.error("Error fetching client:", errorDetails);
        throw new HttpError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          "ไม่สามารถดึงข้อมูล Client"
        );
      }

      const clients = await clientResponse.json();
      const client = clients.find(
        (c: { clientId: string }) => c.clientId === "express-client"
      );

      if (!client) {
        throw new HttpError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          "ไม่พบ Client 'express-client'"
        );
      }

      // ดึง roles ของ Client
      const rolesResponse = await fetch(
        `${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/clients/${client.id}/roles`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!rolesResponse.ok) {
        const errorDetails = await rolesResponse.text();
        console.error("Error fetching roles:", errorDetails);
        throw new HttpError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          "ไม่สามารถดึง roles ของ Client"
        );
      }

      const roles = await rolesResponse.json();
      const userRole = roles.find(
        (role: { name: string }) => role.name === "user"
      );

      if (!userRole) {
        throw new HttpError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          "ไม่พบ role 'user' ใน Client 'express-client'"
        );
      }

      // Assign role ให้กับผู้ใช้
      const roleMappingResponse = await fetch(
        `${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users/${userId}/role-mappings/clients/${client.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify([userRole]),
        }
      );

      if (!roleMappingResponse.ok) {
        const errorDetails = await roleMappingResponse.text();
        console.error("Error assigning role:", errorDetails);
        throw new HttpError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          "ไม่สามารถกำหนด role ให้กับผู้ใช้"
        );
      }

      return { message: "User created successfully", userId };
    } catch (error) {
      console.error("Error:", error);
      throw new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "เกิดข้อผิดพลาดในการสร้างผู้ใช้"
      );
    }
  }

  // Update user by ID
  @Patch("{id}")
  @Security("keycloak")
  @SuccessResponse("200", "Updated")
  public async updateUser(
    @Path() id: string,
    @Body() requestBody: any,
    @Request() req: Express.Request
  ) {
    const token = req.headers["authorization"]?.includes("Bearer ")
      ? req.headers["authorization"].split(" ")[1]
      : req.headers["authorization"];

    if (!token) {
      throw new HttpError(
        HttpStatus.UNAUTHORIZED,
        "ไม่พบข้อมูลสำหรับยืนยันตัวตน"
      );
    }

    try {
      // ตรวจสอบ role ของผู้ใช้จาก token
      const decodedToken = await this.getDecodedToken(token);

      // ตรวจสอบว่า token เป็นของ admin หรือผู้ใช้ตัวเอง
      if (decodedToken.roles.includes("admin") || decodedToken.sub === id) {
        // กำหนดฟิลด์ที่สามารถแก้ไขได้ตาม role
        let allowedFields: any = {};

        // สำหรับ admin สามารถแก้ไขได้ทั้งหมด
        if (decodedToken.roles.includes("admin")) {
          allowedFields = {
            username: requestBody.username,
            email: requestBody.email,
            password: requestBody.password,
            firstname: requestBody.firstname,
            lastname: requestBody.lastname,
          };
        }
        // สำหรับ user สามารถแก้ไขแค่ firstname, lastname
        else if (decodedToken.sub === id) {
          allowedFields = {
            firstname: requestBody.firstname,
            lastname: requestBody.lastname,
          };
        }

        // ทำการอัปเดตข้อมูลใน Keycloak
        const updateUser = await fetch(
          `${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users/${id}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(allowedFields),
          }
        );

        if (!updateUser.ok) {
          throw new HttpError(
            HttpStatus.UNAUTHORIZED,
            "ไม่สามารถอัปเดตข้อมูลผู้ใช้"
          );
        }

        return await updateUser.json();
      } else {
        // หากผู้ใช้ไม่ใช่ admin หรือไม่ใช่เจ้าของ id
        throw new HttpError(
          HttpStatus.FORBIDDEN,
          "คุณไม่สามารถแก้ไขข้อมูลของผู้ใช้อื่นได้"
        );
      }
    } catch (error) {
      throw new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "เกิดข้อผิดพลาดในการอัปเดตผู้ใช้"
      );
    }
  }

  // ฟังก์ชันเพื่อดึงข้อมูล decoded token
  private async getDecodedToken(token: string) {
    const response = await fetch(
      `${KEYCLOAK_URL}/protocol/openid-connect/userinfo`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("ไม่สามารถดึงข้อมูลผู้ใช้จาก token");
    }

    return await response.json(); // เราจะใช้ข้อมูลที่ return มาใน decodedToken
  }

  // Delete user by ID
  @Delete("{id}")
  @Security("keycloak")
  @SuccessResponse("200", "Deleted")
  public async deleteUser(@Path() id: string, @Request() req: Express.Request) {
    const token = req.headers["authorization"]?.includes("Bearer ")
      ? req.headers["authorization"].split(" ")[1]
      : req.headers["authorization"];

    if (!token) {
      throw new HttpError(
        HttpStatus.UNAUTHORIZED,
        "ไม่พบข้อมูลสำหรับยืนยันตัวตน"
      );
    }

    try {
      const deleteUser = await fetch(
        `${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!deleteUser.ok) {
        throw new HttpError(HttpStatus.UNAUTHORIZED, "ไม่สามารถลบผู้ใช้");
      }

      return { message: "User deleted successfully" };
    } catch (error) {
      throw new HttpError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        "เกิดข้อผิดพลาดในการลบผู้ใช้"
      );
    }
  }
}
