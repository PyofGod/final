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
  /**
   * Get all employees
   */
  @Get()
  @Security("keycloak")
  public async getEmployees(
    @Request() req: Express.Request & { user: { role: string[] } }
  ) {
    if (!req.user.role.includes("admin")) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    return prisma.employee.findMany();
  }

  /**
   * Get employee by ID
   * @param id
   */
  @Get("{id}")
  @Security("keycloak")
  public async getEmployeeById(
    @Path() id: string,
    @Request() req: Express.Request & { user: { role: string[] } }
  ) {
    if (!req.user.role.includes("admin")) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
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
    return employee || { message: "Employee not found" };
  }

  /**
   * Create a new employee
   */
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
    if (!req.user.role.includes("admin")) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    return prisma.employee.create({
      data: requestBody,
    });
  }

  /**
   * Update employee by ID
   * @param id
   */
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
    if (!req.user.role.includes("admin")) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const idNumber = parseInt(id, 10);
    return prisma.employee.update({
      where: { Id: idNumber },
      data: requestBody,
    });
  }

  /**
   * Delete employee by ID
   * @param id
   */
  @Delete("{id}")
  @Security("keycloak")
  @SuccessResponse("200", "Deleted")
  public async deleteEmployee(
    @Path() id: string,
    @Request() req: Express.Request & { user: { role: string[] } }
  ) {
    if (!req.user.role.includes("admin")) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const idNumber = parseInt(id, 10);
    await prisma.employee.delete({ where: { Id: idNumber } });
    return { message: "Employee deleted successfully" };
  }
}
