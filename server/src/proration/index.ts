import express, { Request, Response } from "express";
import prorate from "./prorate";

export default function () {
  const router = express.Router();

  router.post("/prorate", async (req: Request, res: Response) => {
    const { allocation, investorAmounts } = req.body;

    const proratedAmounts = prorate(allocation, investorAmounts)

    res.status(200).send({
      proratedAmounts
    })
  });

  return router;
}
