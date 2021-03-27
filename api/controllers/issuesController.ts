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
    this.router.post(this.path + "/:id/rate", this.rate);
    this.router.delete(this.path + "/:id/rate", this.deleteRating);
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

  deleteRating = async (
    req: express.Request,
    res: express.Response
  ) => {
    try {
      await models.Rating.destroy({
        where: {
          issueId: req.params.id,
          roundId: req.body.roundId
        }
      });
      res.sendStatus(200);
    } catch(error) {
      console.error(error);
      res.send(error);
    }
  }


  rate = async (
    req: express.Request,
    res: express.Response
  ) => {

    try {
      let rating = await models.Rating.findOne({
        where: {
          issueId: req.params.id,
          roundId: req.body.roundId
        }
      });

      if (!rating) {
        rating = await models.Rating.create({
          issueId: parseInt(req.params.id!),
          roundId: req.body.roundId,
          userId: 1, // TODO: Add login
          value: req.body.value
        })
      } else {
        rating.value = req.body.value
        await rating.save();
      }
      res.sendStatus(200);
    } catch(error) {
      console.error(error);
      res.send(error);
    }
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
  }

  addRating = async (
    req: express.Request,
    res: express.Response
  ) => {
    models.Rating.create(
      req.body
    ).then( project => {
      res.send(project);
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
