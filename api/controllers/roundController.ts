import express from "express";
const { Client } = require("@elastic/elasticsearch");

import { models } from "../models";

export class TrendsController {
  public path = "/api/trends";
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path, this.createProject);
    this.router.get(this.path+"/:id", this.createProject);
  }

  createProject = async (
    req: express.Request,
    res: express.Response
  ) => {
    models.Project.create(
      req.body
    ).then( project => {
      res.send(project);
    }).catch( error => {
      res.send(error);
    })
  }

  getProjects = async (
    req: express.Request,
    res: express.Response
  ) => {
    models.Project.findAll({
      where: {
        id: req.params.id
      }
    }).then( project => {
      res.send(project);
    }).catch( error => {
      res.send(error);
    })
  }
}
