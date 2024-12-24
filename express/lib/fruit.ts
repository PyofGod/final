import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const fruitRoute = express.Router();

fruitRoute.get("/", async (req: Request, res: Response) => {
  try {
    const fruits = await prisma.fruit.findMany();
    res.json(fruits);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch fruits" });
  }
});

fruitRoute.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const afruit = await prisma.fruit.findUnique({
      where: { id },
    });
    if (afruit) {
      res.json(afruit);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch the fruit" });
  }
});

fruitRoute.post("/", async (req: Request, res: Response) => {
  const { name, color } = req.body;
  try {
    const afruit = await prisma.fruit.create({
      data: { name, color },
    });
    res.status(201).json(afruit);
  } catch (error) {
    res.status(500).json({ error: "Failed to create fruit" });
  }
});

fruitRoute.delete("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const afruit = await prisma.fruit.findUnique({
      where: { id },
    });
    if (afruit) {
      await prisma.fruit.delete({
        where: { id },
      });
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the fruit" });
  }
});

fruitRoute.patch("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, color } = req.body;
  try {
    const afruit = await prisma.fruit.findUnique({
      where: { id },
    });
    if (afruit) {
      const updatedFruit = await prisma.fruit.update({
        where: { id },
        data: {
          name: name ?? afruit.name,
          color: color ?? afruit.color,
        },
      });
      res.status(200).json(updatedFruit);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update the fruit" });
  }
});
