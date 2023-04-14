import { Request, Response } from "express";
import format from "pg-format";
import { client } from "./database";
import { QueryConfig, QueryResult } from "pg";
import {
  IFullProject,
  IFullProjectResult,
  IProjectCreate,
  IProjectResult,
  ITechnology,
  ITechnologyCreate,
} from "./projectInterfaces";

const createProjects = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const requestBody: IProjectCreate = request.body;

  const requestKeys: string[] = Object.keys(requestBody);

  const requestValues: Array<string | number | Date> =
    Object.values(requestBody);

  const newProject: string = `
    INSERT INTO 
        projects
        (%I)
    VALUES
        (%L)
    RETURNING *;
    `;

  const queryFormat: string = format(newProject, requestKeys, requestValues);

  const queryResult: IProjectResult = await client.query(queryFormat);

  return response.status(201).json(queryResult.rows[0]);
};

const updateProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const requestBody: Partial<IProjectCreate> = request.body;

  const projectId: number = Number(request.params.id);

  const requestKeys: string[] = Object.keys(requestBody);

  const requestValues: Array<number | string | Date> =
    Object.values(requestBody);

  const updateQuey: string = `
    UPDATE
        projects
    SET
        (%I) = ROW(%L)
    WHERE
        id = $1
    RETURNING *;
    `;

  const queryFormat: string = format(updateQuey, requestKeys, requestValues);

  const queryConfig: QueryConfig = {
    text: queryFormat,
    values: [projectId],
  };

  const queryResult: IProjectResult = await client.query(queryConfig);

  return response.json(queryResult.rows[0]);
};

const deleteProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const projectId: number = Number(request.params.id);

  const deleteQuery: string = `
    DELETE FROM 
        projects
    WHERE
        id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: deleteQuery,
    values: [projectId],
  };

  await client.query(queryConfig);

  return response.status(204).json();
};

const getProjectInformation = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const projId: number = Number(request.params.id);

  const getQuery: string = `
    SELECT 
	    p.id "projectId", p."name" "projectName", p."description" "projectDescription", 
	    p."estimatedTime" "projectEstimatedTime", p.repository "projectRepository", 
	    p."startDate" "projectStartDate", p."endDate" "projectEndDate", p."developerId" "projectDeveloperId",
	    t.id "technologyId", t."name" "technologyName"
    FROM 
	    projects p
    LEFT JOIN
	    projects_technologies pt
    ON
	    pt."projectId" = p.id
    LEFT JOIN
	    technologies t 
    ON
	    pt."technologyId" = t.id
    WHERE
      p.id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: getQuery,
    values: [projId],
  };

  const queryResult: IFullProjectResult = await client.query(queryConfig);

  return response.json(queryResult.rows);
};

const addNewTechnology = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const projId: number = Number(request.params.id);
  const requestName: string = request.body.name;

  const requestBody: ITechnologyCreate = request.body;

  const requestKeys: string[] = Object.keys(requestBody);

  const requestValues: string[] = Object.values(requestBody);

  const findTechId: string = `
    SELECT 
      id
    FROM
      technologies
    WHERE name = $1
  `;

  const queryConfigTechId: QueryConfig = {
    text: findTechId,
    values: [requestName],
  };

  const queryResult: QueryResult<Partial<ITechnology>> = await client.query(
    queryConfigTechId
  );

  return response.json(queryResult.rows[0]);
};

export {
  createProjects,
  updateProject,
  deleteProject,
  getProjectInformation,
  addNewTechnology,
};
