import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
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
import HttpError from "../interfaces/http-error";
import HttpStatus from "../interfaces/http-status";

@Route("employees")
export class EmployeeController extends Controller {
  @Get()
  @Security("keycloak")
  public async getEmployees(
    @Request() req: Express.Request & { user: { role: string[] } }
  ) {
    const isAdmin = req.user.role.includes("admin");
    if (!isAdmin) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "ไม่อนุญาต");
    }

    const employees = await prisma.employee.findMany();
    return employees;
  }

  @Get("{id}")
  @Security("keycloak")
  public async getEmployeeById(
    @Path() id: string,
    @Request() req: Express.Request & { user: { role: string[] } }
  ) {
    const isAdmin = req.user.role.includes("admin");
    if (!isAdmin) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "ไม่อนุญาต");
    }

    const idNumber = parseInt(id, 10);
    const employee = await prisma.employee.findFirst({
      where: { Id: idNumber },
      select: {
        Id: true,
        Address: true,
        BirthDate: true,
        City: true,
        Country: true,
        Extension: true,
        FirstName: true,
        HireDate: true,
        HomePhone: true,
        LastName: true,
        Notes: true,
        Photo: true,
        PhotoPath: true,
        PostalCode: true,
        Region: true,
        ReportsTo: true,
        Title: true,
        TitleOfCourtesy: true,
      },
    });
    return employee || "ไม่พบข้อมูล";
  }

  @Post()
  @Security("keycloak")
  @SuccessResponse("201", "Created")
  public async createEmployee(
    @Request() req: Express.Request & { user: { role: string[] } },
    @Body()
    requestBody: {
      Address?: string;
      BirthDate?: string;
      City?: string;
      Country?: string;
      Extension?: string;
      FirstName?: string;
      HireDate?: string;
      HomePhone?: string;
      LastName?: string;
      Notes?: string;
      Photo?: string;
      PhotoPath?: string;
      PostalCode?: string;
      Region?: string;
      ReportsTo?: number;
      Title?: string;
      TitleOfCourtesy?: string;
    }
  ) {
    const isAdmin = req.user.role.includes("admin");
    if (!isAdmin) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "ไม่อนุญาต");
    }

    const employee = await prisma.employee.create({
      data: requestBody,
    });
    return employee;
  }

  @Patch("{id}")
  @Security("keycloak")
  @SuccessResponse("200", "Updated")
  public async updateEmployee(
    @Request() req: Express.Request & { user: { role: string[] } },
    @Path() id: string,
    @Body()
    requestBody: {
      Address?: string;
      BirthDate?: string;
      City?: string;
      Country?: string;
      Extension?: string;
      FirstName?: string;
      HireDate?: string;
      HomePhone?: string;
      LastName?: string;
      Notes?: string;
      Photo?: string;
      PhotoPath?: string;
      PostalCode?: string;
      Region?: string;
      ReportsTo?: number;
      Title?: string;
      TitleOfCourtesy?: string;
    }
  ) {
    const idNumber = parseInt(id, 10);
    const isAdmin = req.user.role.includes("admin");
    if (!isAdmin) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "ไม่อนุญาต");
    }

    const employee = await prisma.employee.update({
      where: { Id: idNumber },
      data: requestBody,
    });
    return employee;
  }

  @Delete("{id}")
  @Security("keycloak")
  @SuccessResponse("200", "Deleted")
  public async deleteEmployee(
    @Path() id: string,
    @Request() req: Express.Request & { user: { role: string[] } }
  ) {
    const idNumber = parseInt(id, 10);
    const isAdmin = req.user.role.includes("admin");
    if (!isAdmin) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "ไม่อนุญาต");
    }

    await prisma.employee.delete({ where: { Id: idNumber } });
    return "ลบข้อมูลสำเร็จ";
  }
}
