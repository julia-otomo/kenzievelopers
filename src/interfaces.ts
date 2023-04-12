import { QueryResult } from "pg";

interface IDeveloper {
  id: number;
  name: string;
  email: string;
}

interface IDeveloperInformation {
  id: number;
  developerSince: Date;
  preferredOS: "Windows" | "Linux" | "MacOs";
  developerId: number;
}

type IResult = QueryResult<IDeveloper>;

type IDeveloperCreate = Omit<IDeveloper, "id">;

type IDeveloperInformationCreate = Omit<IDeveloperInformation, "id">;

export {
  IResult,
  IDeveloper,
  IDeveloperCreate,
  IDeveloperInformation,
  IDeveloperInformationCreate,
};
