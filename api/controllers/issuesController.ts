import express from "express";
import { models } from "../models";

export class IssuesController {
  public path = "/api/issues";
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path + "/:id/addComment", this.addComment);
    this.router.post(this.path + "/:id/addAction", this.addAction);
    this.router.post(this.path + "/:id/vote", this.vote);
    this.router.post(this.path + "/:id/score", this.score);
  }

  vote = async (
    req: express.Request,
    res: express.Response
  ) => {
    models.Issue.findOne({
      where: {
        id: req.params.id
      },
    }).then( async issue => {
      if (issue) {
        if (req.body.value == 1) {
          await issue!.increment("counterUpVotes");
          res.sendStatus(200);
        } else {
          await issue!.increment("counterDownVotes");
          res.sendStatus(200);
        }
      } else {
        res.sendStatus(404);
      }
    }).catch( error => {
      res.send(error);
    })
  }

  score = async (
    req: express.Request,
    res: express.Response
  ) => {
    models.Issue.findOne({
      where: {
        id: req.params.id
      },
    }).then( async issue => {
      if (issue) {
        issue.score = req.body.value;
        issue.save().then(()=>{
          res.sendStatus(200);
        }).catch( error => {
          res.send(error);
        })
      } else {
        res.sendStatus(404);
      }
    }).catch( error => {
      res.send(error);
    })
  }

  addAction = async (
    req: express.Request,
    res: express.Response
  ) => {

    models.ActionPlan.create().then(actionPlan => {
      req.body.actionPlanId=actionPlan.id;

      models.Action.create(
        req.body
      ).then( action => {
        res.send(action);
      }).catch( error => {
        res.send(error);
      })
    })
    models.Action.findAll().then(all=>{
      console.error(all.length);
    })
  }

  addComment = async (
    req: express.Request,
    res: express.Response
  ) => {
    models.Comment.create(
      req.body
    ).then( project => {
      res.send(project);
    }).catch( error => {
      res.send(error);
    })
  }
}
