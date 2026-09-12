import express from "express";
import cookieParser from "cookie-parser";
const app = express();
import cors from "cors";

app.use(
  cors({
    origin: "https://hoppscotch.io",
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("Public"));
app.use(cookieParser());

import userroute from "./routes/user.route.js";
import profileroute from "./routes/user_profile.route.js";

app.use("/api/v1/linkedIn", userroute);
app.use("/api/v1/linkedIn", profileroute);

export default app;
