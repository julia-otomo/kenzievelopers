import express, { Application } from "express";
import "dotenv/config";
import {
  verifyDeveloperInformation,
  verifyEmail,
  verifyId,
  verifyProjectId,
  verifyTechnologyInProject,
  verifyTechnologyName,
} from "./middlewares";
import {
  createDeveloper,
  createDeveloperInformation,
  deleteDeveloper,
  getDeveloperById,
  updateDeveloper,
} from "./developersLogic";
import {
  addNewTechnology,
  createProjects,
  deleteProject,
  deleteTechnology,
  getProjectInformation,
  updateProject,
} from "./projectsLogic";

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

app.get("/projects/:id", verifyProjectId, getProjectInformation);

app.post("/projects", verifyId, createProjects);

app.patch("/projects/:id", verifyProjectId, verifyId, updateProject);

app.delete("/projects/:id", verifyProjectId, deleteProject);

app.post(
  "/projects/:id/technologies",
  verifyProjectId,
  verifyTechnologyName,
  verifyTechnologyInProject,
  addNewTechnology
);

app.delete(
  "/projects/:id/technologies/:name",
  verifyProjectId,
  verifyTechnologyName,
  verifyTechnologyInProject,
  deleteTechnology
);

export default app;
