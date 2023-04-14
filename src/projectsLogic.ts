import { Request, Response } from "express";
import format from "pg-format";
import { client } from "./database";
import { QueryConfig, QueryResult } from "pg";
import {
  IFullProjectResult,
  IProjectCreate,
  IProjectResult,
  IProjectTechnologyCreate,
  ITechResult,
  ITechnology,
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
): Promise<Response | void> => {
  const projId: number = Number(request.params.id);
  const requestName: string = request.body.name;

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

  const dataTime = new Date();

  const requestData: IProjectTechnologyCreate = {
    addedIn: dataTime,
    technologyId: Number(queryResult.rows[0].id),
    projectId: projId,
  };

  const requestKeys: string[] = Object.keys(requestData);

  const requestValues: Array<number | Date> = Object.values(requestData);

  const addTech: string = `
    INSERT INTO
      projects_technologies
      (%I)
    VALUES
      (%L)
  `;

  const queryFormat: string = format(addTech, requestKeys, requestValues);

  await client.query(queryFormat);

  const getCreateInformation: string = `
    SELECT 
      t.id "technologyId", t.name "technologyName", p.id "projectId",
      p.name "projectName", p.description "projectDescription",
      p."estimatedTime" "projectEstimatedTime", p.repository 
      "projectRepository", p."startDate" "projectStartDate",
      p."endDate" "projectEndDate"
    FROM
      projects p
    LEFT JOIN
      projects_technologies pt
    ON
      p.id = pt."projectId"
    LEFT JOIN
      technologies t
    ON
      pt."technologyId" = t.id
    WHERE
      p.id = $1 AND t.id = $2
  `;

  const queryProjectConfig: QueryConfig = {
    text: getCreateInformation,
    values: [projId, Number(queryResult.rows[0].id)],
  };

  const queryJoinResult: IFullProjectResult = await client.query(
    queryProjectConfig
  );

  return response.status(201).json(queryJoinResult.rows[0]);
};

const deleteTechnology = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const projId: number = Number(request.params.id);

  const techName: string = request.params.name;

  const findTechId: string = `
    SELECT 
      id
    FROM
      technologies
    WHERE
      name = $1;
  `;

  const queryTechConfig: QueryConfig = {
    text: findTechId,
    values: [techName],
  };

  const querytechResult: QueryResult<Partial<ITechnology>> = await client.query(
    queryTechConfig
  );

  const deleteQuery: string = `
    DELETE FROM
      projects_technologies
    WHERE
    "projectId" = $1 AND "technologyId" = $2;
  `;

  const queryProjectConfig: QueryConfig = {
    text: deleteQuery,
    values: [projId, Number(querytechResult.rows[0].id)],
  };

  await client.query(queryProjectConfig);

  return response.status(204).send();
};

export {
  createProjects,
  updateProject,
  deleteProject,
  getProjectInformation,
  addNewTechnology,
  deleteTechnology,
};
