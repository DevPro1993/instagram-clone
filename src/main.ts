import "reflect-metadata";
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import authenticationMiddleware from "./middlewares/authentication.middleware";
import db from "./database/sequelize.config";
import cors from 'cors';
import registerRoutes from "./routes/index.routes";
import asyncStoreMiddleware from "./utils/async-local-storage/async-store.middleware";

dotenv.config();

// Set the port
const port = process.env.PORT || 3000;

// Instantiate the app
const app: Express = express();

// start the server
startServer(app);

async function startServer(app: Express) {

  app.use(cors())

  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json({ limit: process.env.FILE_UPLOAD_LIMIT }))

  app.use(asyncStoreMiddleware);

  app.use(authenticationMiddleware);

  // Register the routes
  registerRoutes(app)

  app.use((req: Request, res: Response) => res.send('Route Not Found'))

  await db.authenticate()

  console.log('Connection has been established successfully.');

  await db.sync({ force: process.env.DB_RESET === "true" });

  console.log(`Models synced successfully. force = ${process.env.DB_RESET}`);

  // Start the server
  app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));

}