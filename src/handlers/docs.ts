import { Request, Response } from "express";
import YAML from "yamljs";

const swaggerUi = require("swagger-ui-express");
const apiDoc = YAML.load("./openapi.yaml");

export const docsHandler = swaggerUi.serve;
export const docGet = swaggerUi.setup(apiDoc);
export function apiDocServer(request: Request, response: Response): Response {
    return response.status(200).json(apiDoc);
}
