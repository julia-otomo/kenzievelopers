import { QueryResult } from "pg";

interface IDeveloper {
  id: number;
  name: string;
  email: string;
}

interface IDeveloperInformation {
  id: number;
  developerSince: Date;
  preferredOS: string;
  developerId: number;
}

interface IDeveloperPlusInformations {
  developerId: number;
  developerName: string;
  developerEmail: string;
  developerInfoDeveloperSince: Date;
  developerInfoPreferredOS: string;
}

type IResult = QueryResult<IDeveloper>;

type IResultDeveloperInformation = QueryResult<IDeveloperInformation>;

type IDeveloperCreate = Omit<IDeveloper, "id">;

type IDeveloperInformationCreate = Omit<
  IDeveloperInformation,
  "id" | "developerId"
>;

export {
  IResult,
  IDeveloper,
  IDeveloperCreate,
  IDeveloperInformation,
  IDeveloperInformationCreate,
  IResultDeveloperInformation,
  IDeveloperPlusInformations,
};
