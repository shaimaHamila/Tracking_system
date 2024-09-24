import { Application } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API",
    version: "1.0.0",
    description: "API documentation for Express application",
  },
  url: "https://localhost:6001", // the host or url of the app
  basePath: "/api/v1", // the basepath of your endpoint
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"], // Path to your route files
};

const swaggerSpec = swaggerJsDoc(options);

export const setupSwagger = (app: Application) => {
  // Serve Swagger UI with the dynamically generated Swagger JSON
  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, { explorer: true })
  );
};
