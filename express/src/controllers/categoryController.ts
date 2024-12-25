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

@Route("categories")
export class CategoryController extends Controller {
  @Get()
  public async getCategories() {
    const categories = prisma.categories.findMany();
    return categories;
  }

  /**
   * Get category by ID
   * @param id
   */
  @Get("{id}")
  public async getCategoryById(@Path() id: string) {
    return [];
  }

  /**
   * Create a category
   */
  @Post()
  @Security("keycloak")
  @SuccessResponse("201", "Created")
  public async createCategory(
    @Request() req: Express.Request & { user: { role: string[] } },
    @Body() requestBody: { name: string; description: string }
  ) {
    return { id: 1, ...requestBody };
  }

  /**
   * Update a category
   * @param id
   */
  @Patch("{id}")
  @Security("keycloak")
  @SuccessResponse("200", "Updated")
  public async updateCategory(
    @Request() req: Express.Request & { user: { role: string[] } },
    @Path() id: string,
    @Body() requestBody: { name: string; description: string }
  ) {
    return { id, ...requestBody };
  }

  /**
   * Delete a category
   * @param id
   */
  @Delete("{id}")
  @Security("keycloak")
  @SuccessResponse("200", "Deleted")
  public async deleteCategory(
    @Path() id: string,
    @Request() req: Express.Request & { user: { role: string[] } }
  ) {
    return { message: "Category deleted successfully" };
  }
}
