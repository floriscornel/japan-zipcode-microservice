import { Request, Response } from "express";
import { getAddress } from "../stores/zipcodes";

export function healthHandler(request: Request, response: Response): Response {
    if (getAddress("111-0053")?.prefecture.kanji !== "東京都") {
        return response.status(503).json({
            status: "NOT OK",
        });
    }
    if (getAddress("3448686")?.office.name.kanji !== "春日部税務署") {
        return response.status(503).json({
            status: "NOT OK",
        });
    }
    return response.status(200).json({
        status: "OK",
    });
}
