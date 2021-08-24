import express from "express";
import { addressApiHandler } from "./handlers/addressApi";
import { handler as graphqlHandler } from "./handlers/graphql";
import { healthHandler } from "./handlers/health";
import { docsHandler, docGet, apiDocServer } from "./handlers/docs";
import { homePage } from "./handlers/home";

const app = express();
app.use("/health", healthHandler);
app.use("/address/:zipcode", addressApiHandler);
app.use("/graphql", graphqlHandler);
app.use("/docs", docsHandler);
app.get("/docs", docGet);
app.use("/openapi.json", apiDocServer);
app.get("/", homePage);

app.listen(3050);
console.log("Running at 0.0.0.0:3050.");
