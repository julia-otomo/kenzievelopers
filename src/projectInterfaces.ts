import { QueryResult } from "pg";

interface IProject {
  id: number;
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate?: Date;
  developerId: number;
}

interface IFullProject {
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectEstimatedTime: string;
  projectRepository: string;
  projectStartDate: Date;
  projectEndDate: Date;
  projectDeveloperId: number;
  technologyName: string;
}

interface ITechnology {
  id: number;
  name: string;
}

type IProjectResult = QueryResult<IProject>;

type IFullProjectResult = QueryResult<IFullProject>;

type IProjectCreate = Omit<IProject, "id">;

type ITechnologyCreate = Omit<ITechnology, "id">;

type ITechResult = QueryResult<ITechnology>;

export {
  IProject,
  IProjectResult,
  IProjectCreate,
  IFullProject,
  IFullProjectResult,
  ITechnology,
  ITechnologyCreate,
  ITechResult,
};
