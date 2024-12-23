import "dotenv/config";
import express, { Express, Request, Response, NextFunction } from "express";
const app: Express = express();
import cors from "cors";
import { fruitRoute } from "../lib/fruit";

const port = Number(process.env.PORT) || 3000;
const apikey = process.env.APIKEY || "123456789";
if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}
const apiKeyCheck = (req: Request, res: Response, next: NextFunction) => {
  console.log("Middleware");
  if (req.headers.apikey !== apikey) {
    res.status(401).json({ error: "Unauthorized" });
  } else {
    next();
  }
};
//app.use(apiKeyCheck);
app.get("/hello2", apiKeyCheck, (_req, res) => {
  res.send("Hello 2");
});
app.use("/api/fruits", fruitRoute);
app.get("/", (req, res) => {
  res.send("Hello Express");
});
app.listen(port, () => console.log(`Application is running on port ${port}`));
