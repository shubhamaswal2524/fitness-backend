import express, { Application } from "express";
import http from "http";
import os from "os";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";
import { setupSwagger } from "./config/swagger.config";

export default class ExpressServer {
  private app: Application;

  constructor() {
    dotenv.config();
    this.app = express();
    this.setupMiddleware();
    this.listen(8000);
  }

  private setupMiddleware(): void {
    const root = path.normalize(__dirname + "/../..");

    // Body parsing middleware
    this.app.use(
      bodyParser.json({ limit: process.env.REQUEST_LIMIT || "100kb" })
    );
    this.app.use(
      bodyParser.text({ limit: process.env.REQUEST_LIMIT || "100kb" })
    );
    this.app.use(
      bodyParser.urlencoded({
        extended: true,
        limit: process.env.REQUEST_LIMIT || "100kb",
      })
    );
    setupSwagger(this.app);
    // CORS Middleware
    this.app.use(cors({ origin: "*", credentials: true }));

    // Cookie Parser Middleware
    this.app.use(cookieParser(process.env.SESSION_SECRET));

    // Serve static files
    this.app.use(express.static(`${root}/public`));

    // OpenAPI specification & validation setup
    const apiSpec = path.join(__dirname, "api.yml");
    // const validateResponses =
    //   process.env.OPENAPI_ENABLE_RESPONSE_VALIDATION &&
    //   process.env.OPENAPI_ENABLE_RESPONSE_VALIDATION.toLowerCase() === "true";

    this.app.use(process.env.OPENAPI_SPEC || "/spec", express.static(apiSpec));

    // this.app.use(
    //   OpenApiValidator.middleware({
    //     apiSpec,
    //     validateResponses,
    //     ignorePaths: /.*\/spec(\/|$)/,
    //   })
    // );
  }

  router(routes: (app: Application) => void): ExpressServer {
    routes(this.app);
    // this.app.use(errorHandler);
    return this;
  }

  listen(port: number): Application {
    const welcome = (p: number) => (): void => {
      console.info(
        `Up and running in ${process.env.NODE_ENV || "development"} ` +
          `@ ${os.hostname()} on port: ${p}`
      );
    };
    console.log("port", port);
    http.createServer(this.app).listen(port, welcome(port));

    return this.app;
  }
}
