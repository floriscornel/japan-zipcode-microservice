import { Request, Response } from "express";
const path = require("path");

export function homePage(request: Request, response: Response): Response {
    return response.status(200).sendFile(path.join(__dirname, "../../static/index.html"));
}
