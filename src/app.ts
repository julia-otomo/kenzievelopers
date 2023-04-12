import express, { Application } from "express";
import "dotenv/config";
import { verifyEmail, verifyId } from "./middlewares";
import { createDeveloper, deleteDeveloper, updateDeveloper } from "./logics";

const app: Application = express();

app.use(express.json());

app.post("/developers", verifyEmail, createDeveloper);

app.patch("/developers/:id", verifyId, verifyEmail, updateDeveloper);

app.delete("developers/:id", verifyId, deleteDeveloper);

app.post("/developers/:id/infos", verifyId);

export default app;
