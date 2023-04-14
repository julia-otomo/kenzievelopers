import { Request, Response } from "express";
import {
  IDeveloperCreate,
  IDeveloperInformationCreate,
  IDeveloperPlusInformations,
  IResult,
  IResultDeveloperInformation,
} from "./developerInterfaces";
import format from "pg-format";
import { client } from "./database";
import { QueryConfig, QueryResult } from "pg";

const createDeveloper = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const requestBody: IDeveloperCreate = request.body;

  const requestKeys: string[] = Object.keys(requestBody);
  const requestValues: Array<string | number> = Object.values(requestBody);

  const newDeveloper: string = `
    INSERT INTO 
        developers 
        (%I)
    VALUES
        (%L)
    RETURNING *
  `;

  const queryFormat: string = format(newDeveloper, requestKeys, requestValues);

  const queryResult: IResult = await client.query(queryFormat);

  return response.status(201).json(queryResult.rows[0]);
};

const updateDeveloper = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const requestBody: Partial<IDeveloperCreate> = request.body;
  const developerId: number = Number(request.params.id);

  const requestKeys: string[] = Object.keys(requestBody);
  const requestValues: Array<string | number> = Object.values(requestBody);

  const updateQuery: string = `
    UPDATE
        developers
    SET
        (%I) = ROW(%L)
    WHERE
        id = $1
    RETURNING *
  `;

  const queryFormat: string = format(updateQuery, requestKeys, requestValues);

  const queryConfig: QueryConfig = {
    text: queryFormat,
    values: [developerId],
  };

  const queryResult: IResult = await client.query(queryConfig);

  return response.json(queryResult.rows[0]);
};

const deleteDeveloper = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const developerId: number = Number(request.params.id);

  const deleteQuery: string = `
    DELETE FROM
        developers
    WHERE 
        id = $1
  `;

  const queryConfig: QueryConfig = {
    text: deleteQuery,
    values: [developerId],
  };

  await client.query(queryConfig);

  return response.status(204).send();
};

const createDeveloperInformation = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const devId: number = Number(request.params.id);

  const requestBody: IDeveloperInformationCreate = request.body;

  if (!["Windows", "Linux", "MacOS"].includes(requestBody.preferredOS)) {
    return response.status(400).json({
      message: "Invalid OS option.",
      options: ["Windows", "Linux", "MacOS"],
    });
  }

  const requestData: IDeveloperInformationCreate & { developerId: number } = {
    ...requestBody,
    developerId: devId,
  };

  const requestKeys: string[] = Object.keys(requestData);
  const requestValues: Array<string | number | Date> =
    Object.values(requestData);

  const newDevInformation: string = `
    INSERT INTO 
        developer_infos 
        (%I)
    VALUES
        (%L)
    RETURNING *;
  `;

  const queryFormat: string = format(
    newDevInformation,
    requestKeys,
    requestValues
  );

  const queryResult: IResultDeveloperInformation = await client.query(
    queryFormat
  );

  return response.status(201).json(queryResult.rows[0]);
};

const getDeveloperById = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const devId: number = Number(request.params.id);

  const getDev: string = `
    SELECT 
      d.id AS "developerId", d."name" AS "developerName", d."email" AS "developerEmail", di."developerSince" AS "developerInfoDeveloperSince", di."preferredOS" AS "developerInfoPreferredOS"
    FROM 
      developers d 
    LEFT JOIN
      developer_infos di 
    ON
      d.id = di."developerId"
    WHERE d.id = $1
  `;

  const queryConfig: QueryConfig = {
    text: getDev,
    values: [devId],
  };

  const queryResult: QueryResult<IDeveloperPlusInformations> =
    await client.query(queryConfig);

  return response.json(queryResult.rows[0]);
};

export {
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
  createDeveloperInformation,
  getDeveloperById,
};
