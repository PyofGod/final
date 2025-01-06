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

@Route("customers")
export class CustomerController extends Controller {
  /**
   * Get all customers
   */
  @Get()
  @Security("keycloak")
  public async getCustomers(
    @Request() req: Express.Request & { user: { role: string[] } }
  ) {
    if (!req.user.role.includes("admin")) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    return prisma.customer.findMany();
  }

  /**
   * Get customer by ID
   * @param id
   */
  @Get("{id}")
  @Security("keycloak")
  public async getCustomerById(
    @Path() id: string,
    @Request() req: Express.Request & { user: { role: string[] } }
  ) {
    if (!req.user.role.includes("admin")) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const customer = await prisma.customer.findFirst({
      where: { Id: id },
    });
    return customer || { message: "Customer not found" };
  }

  /**
   * Create a new customer
   */
  @Post()
  @Security("keycloak")
  @SuccessResponse("201", "Created")
  public async createCustomer(
    @Request() req: Express.Request & { user: { role: string[] } },
    @Body()
    requestBody: {
      Address?: string;
      City?: string;
      CompanyName?: string;
      ContactName?: string;
      ContactTitle?: string;
      Country?: string;
      Fax?: string;
      Phone?: string;
      PostalCode?: string;
      Region?: string;
    }
  ) {
    if (!req.user.role.includes("admin")) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    return prisma.customer.create({
      data: requestBody,
    });
  }

  /**
   * Update customer by ID
   * @param id
   */
  @Patch("{id}")
  @Security("keycloak")
  @SuccessResponse("200", "Updated")
  public async updateCustomer(
    @Request() req: Express.Request & { user: { role: string[] } },
    @Path() id: string,
    @Body()
    requestBody: {
      Address?: string;
      City?: string;
      CompanyName?: string;
      ContactName?: string;
      ContactTitle?: string;
      Country?: string;
      Fax?: string;
      Phone?: string;
      PostalCode?: string;
      Region?: string;
    }
  ) {
    if (!req.user.role.includes("admin")) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    return prisma.customer.update({
      where: { Id: id },
      data: requestBody,
    });
  }

  /**
   * Delete customer by ID
   * @param id
   */
  @Delete("{id}")
  @Security("keycloak")
  @SuccessResponse("200", "Deleted")
  public async deleteCustomer(
    @Path() id: string,
    @Request() req: Express.Request & { user: { role: string[] } }
  ) {
    if (!req.user.role.includes("admin")) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    await prisma.customer.delete({ where: { Id: id } });
    return { message: "Customer deleted successfully" };
  }
}
