import express from "express";
import { models } from "../models";

export class ProjectsController {
  public path = "/api/projects";
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path, this.createProject);
    this.router.get(this.path+"/:id", this.getProject);
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

  getProject = async (
    req: express.Request,
    res: express.Response
  ) => {
    models.Project.findAll({
      where: {
        id: req.params.id
      },
      include: [
        {
          model: (models.Round as any),
          as: "Rounds"
        }
      ]
    }).then( project => {
      res.send(project);
    }).catch( error => {
      res.send(error);
    })
  }

  getIssues = async (
    req: express.Request,
    res: express.Response
  ) => {
    models.Issue.findAll({
      where: {
        projectId: req.params.id,
        type: req.params.issueType
      },
      include: [
        {
          model: (models.Round as any),
          as: "Rounds"
        }
      ]
    }).then( project => {
      res.send(project);
    }).catch( error => {
      res.send(error);
    })
  }

}
