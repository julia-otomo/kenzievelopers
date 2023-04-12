import { Request, Response, NextFunction } from "express";
import { QueryConfig } from "pg";
import { IResult } from "./interfaces";
import { client } from "./database";

const verifyId = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  let devId: number = Number(request.params.id);

  const findDev: string = `
    SELECT 
        * 
    FROM 
        developers
    WHERE id = $1   
  `;

  if (
    request.route.path === "/developers/:id/infos" &&
    request.method === "POST"
  ) {
    devId = request.body.developerId;
  }

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

// const verifyPreferredOS = async (
//   request: Request,
//   response: Response,
//   next: NextFunction
// ): Promise<Response | void> => {
//   const requestOs: string = request.body.preferredOS;

//   if (requestOs !== "Windows" || "Linux" || "MacOs" )
// };

export { verifyId, verifyEmail, verifyDeveloperInformation };
