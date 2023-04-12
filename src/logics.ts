import { Request, Response } from "express";
import {
  IDeveloperCreate,
  IDeveloperInformationCreate,
  IResult,
} from "./interfaces";
import format from "pg-format";
import { client } from "./database";
import { QueryConfig } from "pg";

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
  const requestBody: IDeveloperCreate = request.body;
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

  const queryResult: IResult = await client.query(queryConfig);

  return response.status(204).send();
};

const createDeveloperInformation = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const developerId: number = Number(request.params.id);

  const requestBody: IDeveloperInformationCreate = request.body;

  const requestKeys: string[] = Object.keys(requestBody);
  const requestValues: Array<
    string | number | "Windows" | "Linux" | "MacOs" | Date
  > = Object.values(requestBody);

  const newDevInformation: string = `
    INSERT INTO 
        developer_infos 
        (%I, "developerId")
    VALUES
        (%L, $1)
    RETURNING *
  `;

  const queryFormat: string = format(
    newDevInformation,
    requestKeys,
    requestValues
  );

  const queryConfig: QueryConfig = {
    text: queryFormat,
    values: [developerId],
  };

  const queryResult: IResult = await client.query(queryConfig);

  return response.status(201).json(queryResult.rows[0]);
};

export { createDeveloper, updateDeveloper, deleteDeveloper };
