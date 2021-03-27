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
    this.router.post(this.path+"/:id/addParticipants", this.addParticipants);
    this.router.post(this.path+"/:id/addIssue", this.addIssue);
    this.router.get(this.path+"/:id", this.getProject);
    this.router.get(this.path+"/:id/participants", this.getParticipants);
    this.router.get(this.path+"/:id/issues/:issueType", this.getIssues);
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

  addIssue = async (
    req: express.Request,
    res: express.Response
  ) => {
    models.Issue.create(
      req.body
    ).then( issue => {
      res.send(issue);
    }).catch( error => {
      res.send(error);
    })
  }


  addParticipants = async (
    req: express.Request,
    res: express.Response
  ) => {
    models.Project.addParticipants(req.body, res);
  }

  getProject = async (
    req: express.Request,
    res: express.Response
  ) => {
    models.Project.findOne({
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
    console.error(req.params.issueType)
    if ((req.params.issueType as unknown as number) == -1) {
      models.Issue.findAll({
        where: {
          projectId: req.params.id
        },
        include: [
          {
            model: (models.Comment as any),
            include: [
              {
                model: (models.User as any),
                as: "User",
                attributes: ["id","selectedAvatar","selectedAvatarColor"]
              }
            ]
          },
          {
            model: (models.Action as any)
          }
        ]
      }).then(project => {
        res.send(project);
      }).catch( error => {
        console.error(error);
        res.send(error);
      })
   } else {
      models.Issue.findAll({
        where: {
          projectId: req.params.id,
          type: req.params.issueType!="-1" ? req.params.issueType : undefined
        },
        include: [
          {
            model: (models.Comment as any),
            include: [
              {
                model: (models.User as any),
                as: "User",
                attributes: ["id","selectedAvatar","selectedAvatarColor"]
              }
            ]
          }
        ]
      }).then( project => {
        res.send(project);
      }).catch( error => {
        console.error(error);
        res.send(error);
      })
    }
  }

  getParticipants = async (
    req: express.Request,
    res: express.Response
  ) => {
    models.Project.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id'],
      include: [
        {
          model: (models.User as any),
          attributes: {exclude: ['encrypedPassword']},
          include: [
            {
              model: (models.Role as any),
            }
          ]
        }
      ]
    }).then( project => {
      if (project) {
        res.send( project.Users! );
      } else {
        res.sendStatus(404);
      }
    }).catch( error => {
      console.error(error);
      res.send(error);
    })
  }

}
