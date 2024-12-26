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
import { Fruits } from "../model/Fruits";

@Route("fruits")
export class fruitController extends Controller {
  @Get()
  public async getFruit() {
    const fruits = await prisma.fruit.findMany();
    return fruits;
  }

  @Get("{id}")
  public async getFruitById(@Path() id: string) {
    const idNumber = parseInt(id, 10); // แปลง id เป็น number
    const fruit = await prisma.fruit.findFirst({
      where: { Id: idNumber },
    });
    return fruit || "ไม่พบข้อมูล";
  }

  @Post()
  @Security("keycloak")
  @SuccessResponse("201", "Created")
  public async createFruit(
    @Request() req: Express.Request & { user: { role: string[] } },
    @Body() requestBody: Fruits
  ) {
    const isAdmin = req.user.role.includes("admin");
    if (!isAdmin) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "ไม่อนุญาต");
    }
    const fruit = await prisma.fruit.create({ data: requestBody });
    return fruit;
  }

  @Patch("{id}")
  @Security("keycloak")
  @SuccessResponse("200", "Updated")
  public async updateFruit(
    @Request() req: Express.Request & { user: { role: string[] } },
    @Path() id: string,
    @Body() requestBody: Fruits
  ) {
    const idNumber = parseInt(id, 10); // แปลง id เป็น number
    const isAdmin = req.user.role.includes("admin");
    if (!isAdmin) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "ไม่อนุญาต");
    }
    const fruit = await prisma.fruit.update({
      where: { Id: idNumber },
      data: requestBody,
    });
    return fruit;
  }

  @Delete("{id}")
  @Security("keycloak")
  @SuccessResponse("200", "Deleted")
  public async deleteFruit(
    @Path() id: string,
    @Request() req: Express.Request & { user: { role: string[] } }
  ) {
    const idNumber = parseInt(id, 10); // แปลง id เป็น number
    const isAdmin = req.user.role.includes("admin");
    if (!isAdmin) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "ไม่อนุญาต");
    }
    await prisma.fruit.delete({ where: { Id: idNumber } });
    return "ลบข้อมูลสำเร็จ";
  }
}
