import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";
import path from "path";

// Swagger Configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MERN Marketplace API",
      version: "1.0.0",
      description: "API documentation for the MERN marketplace",
    },
    servers: [
      {
        url: "http://localhost:8000", // Update with your actual server URL if different
        description: "Local Development Server",
      },
    ],
  },
  apis: [path.join(__dirname, "../swagger/*.yaml")], // Pointing to the JS files after TypeScript compilation
};

// Initialize Swagger Docs
const swaggerSpec = swaggerJsDoc(swaggerOptions);

export const setupSwagger = (app: Application) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
