import express from "express";
import { models } from "../models";

export class IssueController {
  public path = "/api/issues";
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.post(this.path + "/:id/addComment", this.addComment);
    this.router.post(this.path + "/:id/vote", this.vote);
  }

  vote = async (
    req: express.Request,
    res: express.Response
  ) => {
    models.Issue.findOne({
      where: {
        id: req.params.id
      },
    }).then( project => {
      if (req.body.value == 1) {
        project!.increment("counterUpVotes");
        res.sendStatus(200);
      } else {
        project!.increment("counterDownVotes");
      }
    }).catch( error => {
      res.send(error);
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
