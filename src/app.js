import express from "express";
import cookieParser from "cookie-parser";
const app = express();
import cors from "cors";

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("Public"));
app.use(cookieParser());

import userroute from "./routes/user.route.js";

app.use("/api/v1/linkedIn", userroute);

export default app;
