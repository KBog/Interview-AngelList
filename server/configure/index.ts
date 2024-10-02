// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
const pkg = require("../package.json");

dotenv.config();
const port = process.env.PORT || 8080;

export default function (app: Express) {
  app.use(cors());

  // Catch-all because Chrome sends pre-flight OPTIONS requests to check
  // for CORS headers, so catch these before they go through the whole
  // routing stack
  app.options("*", (req, res) => {
    res.status(204).end("");
  });

  app.get("/status", (req, res) => {
    res.json({
      app: "angellist",
      version: pkg.version,
    });
  });

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });

  return app;
}
