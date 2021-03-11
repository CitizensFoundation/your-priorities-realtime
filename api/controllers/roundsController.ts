import express from "express";
import { models } from "../models";

export class RoundsController {
  public path = "/api/rounds";
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path, this.createRound);
    this.router.get(this.path+"/:id", this.getRound);
  }

  createRound = async (
    req: express.Request,
    res: express.Response
  ) => {
    models.Round.create(
      req.body
    ).then( project => {
      res.send(project);
    }).catch( error => {
      res.send(error);
    })
  }

  getRound = async (
    req: express.Request,
    res: express.Response
  ) => {
    models.Round.findOne({
      where: {
        id: req.params.id,
      },
      attributes: {exclude: ['privateData']}
    }).then( round => {
      res.send(round);
    }).catch( error => {
      res.send(error);
    })
  }
}
