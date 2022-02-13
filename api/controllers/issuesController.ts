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
    this.router.put(this.path + "/:id/setSelectedStatus", this.setSelectedStatus);
  }

  setSelectedStatus = async (
    req: express.Request,
    res: express.Response
  ) => {
    models.Issue.findOne({
      where: {
        id: req.params.id
      },
    }).then( async issue => {
      if (issue) {
        if (req.body.checked == true) {
          issue.selected = true;
          await issue.save();
          res.sendStatus(200);
        } else {
          issue.selected = false;
          await issue.save();
          res.sendStatus(200);
        }
      } else {
        res.sendStatus(404);
      }
    }).catch( error => {
      console.error(error);
      res.send(error);
    })
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
    console.error(JSON.stringify(req.body));
    // @ts-ignore
    console.error(JSON.stringify(req.session.user));
    // @ts-ignore
    if (req.session.user) {
      try {
        let rating = await models.Rating.findOne({
          where: {
            issueId: req.params.id,
            roundId: req.body.roundId,
            // @ts-ignore
            userId: req.session.user ? req.session.user.id : -1
          }
        });

        if (!rating) {
          rating = await models.Rating.create({
            issueId: parseInt(req.params.id!),
            roundId: req.body.roundId,
            userType: req.body.userType,
            // @ts-ignore
            userId: req.session.user.id,
            value: req.body.value
          })
          console.error("NEW RATING");
          console.error(JSON.stringify(rating));
        } else {
          rating.value = req.body.value
          await rating.save();
          console.error("UPDATED RATING");
          console.error(JSON.stringify(rating));
        }
        res.sendStatus(200);
      } catch(error) {
        console.error(error);
        res.send(error);
      }
    } else {
      console.error("ERROR: 404 on rate")
      res.sendStatus(401);
    }
  }


  addAction = async (
    req: express.Request,
    res: express.Response
  ) => {

    models.Action.create(
      req.body
    ).then( action => {
      res.send(action);
    }).catch( error => {
      console.error(error);
      res.send(error);
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
    console.error(req.body);
    if (req.body.User) {
      delete req.body.User;
    }
    models.Comment.create(
      // @ts-ignore
      {...req.body, ...{userId: req.session!.user!.id} }
    ).then( async comment => {
      await comment.reload({
        include: [
          {
            model: (models.User as any),
            as: "User",
            attributes: ["id","selectedAvatar","selectedAvatarColor"]
          }
        ]
      });
      res.send(comment);
    }).catch( error => {
      console.error(error)
      res.send(error);
    })
  }
}
