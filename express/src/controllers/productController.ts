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

@Route("products")
export class ProductController extends Controller {
  @Get()
  public async getProducts() {
    // ดึงข้อมูล Product ทั้งหมด
    const products = await prisma.product.findMany();
    return products;
  }

  @Get("{id}")
  public async getProductById(@Path() id: string) {
    // ดึงข้อมูล Product ตาม ID โดยเลือกเฉพาะคอลัมน์ที่ต้องการ
    const idNumber = parseInt(id, 10);
    const product = await prisma.product.findFirst({
      where: { id: idNumber },
      select: {
        id: true,
        ProductName: true,
        Categories: true,
        Discontinued: true,
        QuantityPerUnit: true,
        ReorderLevel: true,
        SupplierId: true,
        UnitPrice: true,
        UnitsInStock: true,
        UnitsOnOrder: true,
      },
    });
    return product || "ไม่พบข้อมูล";
  }

  @Post()
  @Security("keycloak")
  @SuccessResponse("201", "Created")
  public async createProduct(
    @Request() req: Express.Request & { user: { role: string[] } },
    @Body()
    requestBody: {
      ProductName: string;
      Categories: string;
      Discontinued: number;
      QuantityPerUnit?: string;
      ReorderLevel: number;
      SupplierId: number;
      UnitPrice: string;
      UnitsInStock: number;
      UnitsOnOrder: number;
    }
  ) {
    const isAdmin = req.user.role.includes("admin");
    if (!isAdmin) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "ไม่อนุญาต");
    }

    const product = await prisma.product.create({
      data: {
        ProductName: requestBody.ProductName,
        Categories: requestBody.Categories,
        Discontinued: requestBody.Discontinued,
        QuantityPerUnit: requestBody.QuantityPerUnit,
        ReorderLevel: requestBody.ReorderLevel,
        SupplierId: requestBody.SupplierId,
        UnitPrice: requestBody.UnitPrice,
        UnitsInStock: requestBody.UnitsInStock,
        UnitsOnOrder: requestBody.UnitsOnOrder,
      },
    });
    return product;
  }

  @Patch("{id}")
  @Security("keycloak")
  @SuccessResponse("200", "Updated")
  public async updateProduct(
    @Request() req: Express.Request & { user: { role: string[] } },
    @Path() id: string,
    @Body()
    requestBody: {
      ProductName?: string;
      Categories?: string;
      Discontinued?: number;
      QuantityPerUnit?: string;
      ReorderLevel?: number;
      SupplierId?: number;
      UnitPrice?: string;
      UnitsInStock?: number;
      UnitsOnOrder?: number;
    }
  ) {
    const idNumber = parseInt(id, 10);
    const isAdmin = req.user.role.includes("admin");
    if (!isAdmin) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "ไม่อนุญาต");
    }

    const product = await prisma.product.update({
      where: { id: idNumber },
      data: requestBody,
    });
    return product;
  }

  @Delete("{id}")
  @Security("keycloak")
  @SuccessResponse("200", "Deleted")
  public async deleteProduct(
    @Path() id: string,
    @Request() req: Express.Request & { user: { role: string[] } }
  ) {
    const idNumber = parseInt(id, 10);
    const isAdmin = req.user.role.includes("admin");
    if (!isAdmin) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "ไม่อนุญาต");
    }

    await prisma.product.delete({ where: { id: idNumber } });
    return "ลบข้อมูลสำเร็จ";
  }
}
