import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import type { Express, Request, Response } from "express";
import ENV from "./ENV";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Brew SYS API",
      version: "1.0.0",
      description: "API documentation for the backend",
    },
    servers: [
      {
        url: ENV.BASE_URL,
      },
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/**/*.ts", "./src/**/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.get("/docs", (req: Request, res: Response) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Swagger UI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css">
</head>

<body>
<div id="swagger-ui"></div>

<script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>

<script>
window.onload = () => {
  SwaggerUIBundle({
    url: "/docs.json",
    dom_id: "#swagger-ui"
  });
};
</script>

</body>
</html>
    `);
  });

  app.get("/docs.json", (req: Request, res: Response) => {
    res.json(swaggerSpec);
  });
};