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
  SuccessResponse,
} from "tsoa";

@Route("orders")
export class OrderController extends Controller {
  /**
   * Get all orders (Accessible by everyone)
   */
  @Get()
  public async getOrders() {
    return prisma.order.findMany();
  }

  /**
   * Get order by ID (Accessible by everyone)
   * @param id
   */
  @Get("{id}")
  public async getOrderById(@Path() id: string) {
    const idNumber = parseInt(id, 10);
    const order = await prisma.order.findFirst({
      where: { Id: idNumber },
    });
    return order || { message: "Order not found" };
  }

  /**
   * Create a new order (Accessible by everyone)
   */
  @Post()
  @SuccessResponse("201", "Created")
  public async createOrder(
    @Body()
    requestBody: {
      CustomerId?: string;
      EmployeeId: number;
      Freight: string;
      OrderDate?: string;
      RequiredDate?: string;
      ShipAddress?: string;
      ShipCity?: string;
      ShipCountry?: string;
      ShipName?: string;
      ShipPostalCode?: string;
      ShipRegion?: string;
      ShipVia?: number;
      ShippedDate?: string;
    }
  ) {
    return prisma.order.create({
      data: requestBody,
    });
  }

  /**
   * Update order by ID (Accessible by everyone)
   * @param id
   */
  @Patch("{id}")
  @SuccessResponse("200", "Updated")
  public async updateOrder(
    @Path() id: string,
    @Body()
    requestBody: {
      CustomerId?: string;
      EmployeeId?: number;
      Freight?: string;
      OrderDate?: string;
      RequiredDate?: string;
      ShipAddress?: string;
      ShipCity?: string;
      ShipCountry?: string;
      ShipName?: string;
      ShipPostalCode?: string;
      ShipRegion?: string;
      ShipVia?: number;
      ShippedDate?: string;
    }
  ) {
    const idNumber = parseInt(id, 10);
    return prisma.order.update({
      where: { Id: idNumber },
      data: requestBody,
    });
  }

  /**
   * Delete order by ID (Accessible by everyone)
   * @param id
   */
  @Delete("{id}")
  @SuccessResponse("200", "Deleted")
  public async deleteOrder(@Path() id: string) {
    const idNumber = parseInt(id, 10);
    await prisma.order.delete({ where: { Id: idNumber } });
    return { message: "Order deleted successfully" };
  }
}
