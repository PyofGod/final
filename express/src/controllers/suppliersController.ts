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

@Route("suppliers")
export class SupplierController extends Controller {
  /**
   * Get all suppliers (Accessible by everyone)
   */
  @Get()
  public async getSuppliers() {
    return prisma.supplier.findMany();
  }

  /**
   * Get supplier by ID (Accessible by everyone)
   * @param id
   */
  @Get("{id}")
  public async getSupplierById(@Path() id: string) {
    const idNumber = parseInt(id, 10);
    const supplier = await prisma.supplier.findFirst({
      where: { Id: idNumber },
    });
    return supplier || { message: "Supplier not found" };
  }

  /**
   * Create a new supplier (Admin only)
   */
  @Post()
  @Security("keycloak")
  @SuccessResponse("201", "Created")
  public async createSupplier(
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
      HomePage?: string;
      Phone?: string;
      PostalCode?: string;
      Region?: string;
    }
  ) {
    if (!req.user.role.includes("admin")) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    return prisma.supplier.create({
      data: requestBody,
    });
  }

  /**
   * Update supplier by ID (Admin only)
   * @param id
   */
  @Patch("{id}")
  @Security("keycloak")
  @SuccessResponse("200", "Updated")
  public async updateSupplier(
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
      HomePage?: string;
      Phone?: string;
      PostalCode?: string;
      Region?: string;
    }
  ) {
    if (!req.user.role.includes("admin")) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const idNumber = parseInt(id, 10);
    return prisma.supplier.update({
      where: { Id: idNumber },
      data: requestBody,
    });
  }

  /**
   * Delete supplier by ID (Admin only)
   * @param id
   */
  @Delete("{id}")
  @Security("keycloak")
  @SuccessResponse("200", "Deleted")
  public async deleteSupplier(
    @Path() id: string,
    @Request() req: Express.Request & { user: { role: string[] } }
  ) {
    if (!req.user.role.includes("admin")) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const idNumber = parseInt(id, 10);
    await prisma.supplier.delete({ where: { Id: idNumber } });
    return { message: "Supplier deleted successfully" };
  }
}
