import "express-async-errors";
import express, { Express } from "express";
import cors from "cors";

import { loadEnv, connectDb, disconnectDb } from "@/config";

loadEnv();

const app = express();

import { handleApplicationErrors } from "@/middlewares";
import {
  usersRouter,
  authenticationRouter,
  projectsRouter,
  listsRouter,
  cardsRouter,
} from "@/routers";

app
  .use(cors())
  .use(express.json())
  .get("/health", (_req, res) => {
    res.send("ok!");
  })
  .use("/users", usersRouter)
  .use("/auth", authenticationRouter)
  .use("/projects", projectsRouter)
  .use("/lists", listsRouter)
  .use("/cards", cardsRouter)
  .use(handleApplicationErrors);

export function init(): Promise<Express> {
  connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDb();
}

export default app;
