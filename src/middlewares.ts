import { Request, Response, NextFunction } from "express";
import { QueryConfig } from "pg";
import { IResult } from "./developerInterfaces";
import { client } from "./database";
import { IProjectResult, ITechResult } from "./projectInterfaces";

const verifyId = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  let devId: number = Number(request.params.id);

  if (
    (request.route.path === "/projects" && request.method === "POST") ||
    "PATCH"
  ) {
    devId = Number(request.body.developerId);
  }

  const findDev: string = `
    SELECT 
      * 
    FROM 
     developers
    WHERE id = $1   
  `;

  const queryConfig: QueryConfig = {
    text: findDev,
    values: [devId],
  };

  const queryResult: IResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return response.status(404).json({
      message: "Developer not found.",
    });
  }

  next();
};

const verifyEmail = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const developerEmail: string = request.body.email;

  const findEmail: string = `
    SELECT
        *
    FROM
        developers
    WHERE email = $1
  `;

  const queryConfig: QueryConfig = {
    text: findEmail,
    values: [developerEmail],
  };

  const queryResult: IResult = await client.query(queryConfig);

  if (queryResult.rowCount > 0) {
    return response.status(409).json({
      message: "Email already exists.",
    });
  }

  next();
};

const verifyDeveloperInformation = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const devId: number = Number(request.params.id);

  const verifyId: string = `
    SELECT
      *
    FROM
      developer_infos
    WHERE
      "developerId" = $1
  `;

  const queryConfig: QueryConfig = {
    text: verifyId,
    values: [devId],
  };

  const queryResult: IResult = await client.query(queryConfig);

  if (queryResult.rowCount > 0) {
    return response.status(409).json({
      message: "Developer infos already exists.",
    });
  }

  next();
};

const verifyProjectId = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const projectId: number = parseInt(request.params.id);

  const searchProject: string = `
    SELECT
      *
    FROM
      projects
    WHERE
      id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: searchProject,
    values: [projectId],
  };

  const queryResult: IProjectResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return response.status(404).json({
      message: "Project not found.",
    });
  }

  next();
};

const verifyTechnologyName = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  let requestName: string = request.body.name;

  if (request.route.path === "/projects/:id/technologies/:name") {
    requestName = request.params.name;
  }

  const techQuery: string = `
    SELECT 
      *
    FROM
      technologies
    WHERE
      name = $1;
  `;

  const queryConfig: QueryConfig = {
    text: techQuery,
    values: [requestName],
  };

  const queryResult: ITechResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return response.status(400).json({
      message: "Technology not supported.",
      options: [
        "JavaScript",
        "Python",
        "React",
        "Express.js",
        "HTML",
        "CSS",
        "Django",
        "PostgreSQL",
        "MongoDB",
      ],
    });
  }

  next();
};

const verifyIfTechnologyExistsInASpecificProject = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const projectId = Number(request.params.id);

  let requestName: string = request.body.name;

  if (request.route.path === "/projects/:id/technologies/:name") {
    requestName = request.params.name;
  }

  const findTech: string = `
    SELECT 
      *
    FROM 
      projects p
    JOIN 
      projects_technologies pt 
    ON 
      p.id = pt."projectId"
    JOIN 
      technologies t 
    ON 
      pt."technologyId" = t.id
    WHERE 
      t.name = $1 AND p.id = $2;
  `;

  const queryConfig: QueryConfig = {
    text: findTech,
    values: [requestName, projectId],
  };

  const queryResult: IProjectResult = await client.query(queryConfig);

  if (
    request.route.path === "/projects/:id/technologies" &&
    request.method === "POST"
  ) {
    if (queryResult.rowCount > 0) {
      return response.status(409).json({
        message: "This technology is already associated with the project",
      });
    } else {
      console.log("alô");

      next();
    }
  } else {
    return response.status(400).json({
      message: "Technology not related to the project.",
    });
  }
};

export {
  verifyId,
  verifyEmail,
  verifyDeveloperInformation,
  verifyProjectId,
  verifyTechnologyName,
  verifyIfTechnologyExistsInASpecificProject,
};
