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

@Route("categories")
export class CategoriesController extends Controller {
  /**
   * Get all categories (Accessible by user and admin)
   */
  @Get()
  @Security("keycloak")
  public async getCategories(
    @Request() req: Express.Request & { user: { role: string[] } }
  ) {
    if (!req.user.role.includes("user") && !req.user.role.includes("admin")) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    return prisma.categories.findMany();
  }

  /**
   * Get category by ID (Accessible by user and admin)
   * @param id
   */
  @Get("{id}")
  @Security("keycloak")
  public async getCategoryById(
    @Path() id: string,
    @Request() req: Express.Request & { user: { role: string[] } }
  ) {
    if (!req.user.role.includes("user") && !req.user.role.includes("admin")) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const idNumber = parseInt(id, 10);
    const category = await prisma.categories.findFirst({
      where: { Id: idNumber },
    });
    return category || { message: "Category not found" };
  }

  /**
   * Create a new category (Accessible by user and admin)
   */
  @Post()
  @Security("keycloak")
  @SuccessResponse("201", "Created")
  public async createCategory(
    @Request() req: Express.Request & { user: { role: string[] } },
    @Body()
    requestBody: {
      name: string;
      description?: string;
    }
  ) {
    if (!req.user.role.includes("user") && !req.user.role.includes("admin")) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    return prisma.categories.create({
      data: requestBody,
    });
  }

  /**
   * Update category by ID (Accessible by user and admin)
   * @param id
   */
  @Patch("{id}")
  @Security("keycloak")
  @SuccessResponse("200", "Updated")
  public async updateCategory(
    @Request() req: Express.Request & { user: { role: string[] } },
    @Path() id: string,
    @Body()
    requestBody: {
      name?: string;
      description?: string;
    }
  ) {
    if (!req.user.role.includes("user") && !req.user.role.includes("admin")) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const idNumber = parseInt(id, 10);
    return prisma.categories.update({
      where: { Id: idNumber },
      data: requestBody,
    });
  }

  /**
   * Delete category by ID (Accessible by user and admin)
   * @param id
   */
  @Delete("{id}")
  @Security("keycloak")
  @SuccessResponse("200", "Deleted")
  public async deleteCategory(
    @Path() id: string,
    @Request() req: Express.Request & { user: { role: string[] } }
  ) {
    if (!req.user.role.includes("user") && !req.user.role.includes("admin")) {
      throw new HttpError(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const idNumber = parseInt(id, 10);
    await prisma.categories.delete({ where: { Id: idNumber } });
    return { message: "Category deleted successfully" };
  }
}
