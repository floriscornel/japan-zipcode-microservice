import { Request, Response } from "express";
import { getAddress } from "../stores/zipcodes";

export function healthHandler(request: Request, response: Response): Response {
    const address = getAddress("111-0053");
    if (address.prefectureKanji === "東京都") {
        return response.status(200).json({
            status: "OK",
        });
    }
    return response.status(500).json({
        status: "NOT OK",
    });
}
