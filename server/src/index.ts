import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import proration from "./proration";
import configure from "../configure";

const app: Express = express();
configure(app)

// Middleware to parse JSON bodies otherwise when we do req.body when
// defining routes, the parameters won't make it to us.
app.use(bodyParser.json());

async function configureApps() {
  // Configure subapps
  app.use("/v1/proration", proration());

  app.get("/", (req: Request, res: Response) => {
    res.send("Hello AngelList!");
  });
}

// run().catch(console.dir);

// configure the routes and middleware
configureApps().catch(console.dir);

export default app;
