import express, { Application } from "express";
import "dotenv/config";
import {
  verifyDeveloperInformation,
  verifyEmail,
  verifyId,
} from "./middlewares";
import {
  createDeveloper,
  createDeveloperInformation,
  deleteDeveloper,
  getDeveloperById,
  updateDeveloper,
} from "./logics";

const app: Application = express();

app.use(express.json());

app.post("/developers", verifyEmail, createDeveloper);

app.get("/developers/:id", verifyId, getDeveloperById);

app.patch("/developers/:id", verifyId, verifyEmail, updateDeveloper);

app.delete("/developers/:id", verifyId, deleteDeveloper);

app.post(
  "/developers/:id/infos",
  verifyId,
  verifyDeveloperInformation,
  createDeveloperInformation
);

export default app;
