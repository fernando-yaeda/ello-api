import "express-async-errors";
import express, { Express } from "express";
import cors from "cors";

import { loadEnv } from "./config";

loadEnv();

const app = express();

app.use(cors()).use(express.json());

export default app;
