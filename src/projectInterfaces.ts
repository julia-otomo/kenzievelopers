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
  technologyId: number;
}

interface ITechnology {
  id: number;
  name: string;
}

interface IProjectTechnology {
  id: number;
  addedIn: Date;
  technologyId: number;
  projectId: number;
}

type IProjectResult = QueryResult<IProject>;

type IFullProjectResult = QueryResult<IFullProject>;

type IProjectCreate = Omit<IProject, "id">;

type ITechnologyCreate = Omit<ITechnology, "id">;

type ITechResult = QueryResult<ITechnology>;

type IProjectTechnologyCreate = Omit<IProjectTechnology, "id">;

type IProjectTechnologyResult = QueryResult<IProjectTechnology>;

export {
  IProject,
  IProjectResult,
  IProjectCreate,
  IFullProject,
  IFullProjectResult,
  ITechnology,
  ITechnologyCreate,
  ITechResult,
  IProjectTechnology,
  IProjectTechnologyCreate,
  IProjectTechnologyResult,
};
