import express from "express";
import { models } from "../models";

export class CommentsController {
  public path = "/api/comments";
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.put(this.path + "/:id/vote", this.vote);
  }

  vote = async (
    req: express.Request,
    res: express.Response
  ) => {
    models.Comment.findOne({
      where: {
        id: req.params.id
      },
    }).then( async comment => {
      if (comment) {
        if (req.body.value == 1) {
          await comment!.increment("counterUpVotes");
          res.send(comment);
        } else {
          await comment!.increment("counterDownVotes");
          res.send(comment);
        }
      } else {
        res.sendStatus(404);
      }
    }).catch( error => {
      console.error(error);
      res.send(error);
    })
  }
}
