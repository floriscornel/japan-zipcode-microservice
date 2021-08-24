
import { Request, Response } from "express";
import { getAddress } from "../stores/zipcodes";

export function addressApiHandler(request: Request, response: Response): Response {
    const query = request.params.zipcode ?? null;
    if (query) {
        const address = getAddress(query);
        if (address) {
            return response.status(200).json(address);
        }
    }
    return response.status(404).send("Not found");
}
