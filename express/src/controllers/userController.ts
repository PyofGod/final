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
import Express from "express";
import axios from "axios";
import HttpError from "../interfaces/http-error";
import HttpStatus from "../interfaces/http-status";

@Route("users")
export class UserController extends Controller {
  private baseUrl =
    "https://identity.frappet.synology.me/admin/realms/fluk-tiw/users";

  private getAuthorizationToken(req: Express.Request): string {
    const authorization = req.headers.authorization;
    if (!authorization) {
      throw new HttpError(
        HttpStatus.BAD_REQUEST,
        "Authorization header is missing"
      );
    }

    const token = authorization.split(" ")[1];
    if (!token) {
      throw new HttpError(HttpStatus.BAD_REQUEST, "Bearer token is missing");
    }

    return token;
  }

  /**
   * Get all users (Admin only)
   */
  @Get()
  @Security("keycloak")
  public async getUsers(
    @Request() req: Express.Request & { user: { role: string[] } }
  ) {
    if (!req.user.role.includes("admin")) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const token = this.getAuthorizationToken(req);

    const response = await axios.get(this.baseUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  }

  /**
   * Get user by ID (Admin only)
   * @param id
   */
  @Get("{id}")
  @Security("keycloak")
  public async getUserById(
    @Path() id: string,
    @Request() req: Express.Request & { user: { role: string[] } }
  ) {
    if (!req.user.role.includes("admin")) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const token = this.getAuthorizationToken(req);

    const response = await axios.get(`${this.baseUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  }

  /**
   * Create a new user (Admin only)
   */
  @Post()
  @Security("keycloak")
  @SuccessResponse("201", "Created")
  public async createUser(
    @Request() req: Express.Request & { user: { role: string[] } },
    @Body()
    requestBody: {
      username: string;
      email: string;
      enabled: boolean;
      firstName?: string;
      lastName?: string;
    }
  ) {
    if (!req.user.role.includes("admin")) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const token = this.getAuthorizationToken(req);

    const response = await axios.post(this.baseUrl, requestBody, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  }

  /**
   * Update user by ID (Admin only)
   * @param id
   */
  @Patch("{id}")
  @Security("keycloak")
  @SuccessResponse("200", "Updated")
  public async updateUser(
    @Path() id: string,
    @Request() req: Express.Request & { user: { role: string[] } },
    @Body()
    requestBody: {
      email?: string;
      enabled?: boolean;
      firstName?: string;
      lastName?: string;
    }
  ) {
    if (!req.user.role.includes("admin")) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const token = this.getAuthorizationToken(req);

    const response = await axios.put(`${this.baseUrl}/${id}`, requestBody, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  }

  /**
   * Delete user by ID (Admin only)
   * @param id
   */
  @Delete("{id}")
  @Security("keycloak")
  @SuccessResponse("200", "Deleted")
  public async deleteUser(
    @Path() id: string,
    @Request() req: Express.Request & { user: { role: string[] } }
  ) {
    if (!req.user.role.includes("admin")) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const token = this.getAuthorizationToken(req);

    await axios.delete(`${this.baseUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { message: "User deleted successfully" };
  }
}
