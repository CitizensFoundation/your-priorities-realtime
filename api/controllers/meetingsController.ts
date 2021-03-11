import express from "express";
import { models } from "../models";

export class MeetingsController {
  public path = "/api/meetings";
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path + "/:id", this.getMeeting);
  }

  getMeeting = async (req: express.Request, res: express.Response) => {
    models.Meeting.findOne({
      where: {
        id: req.params.id,
      },
      attributes: { exclude: ["privateData"] },
    })
      .then((meeting) => {
        res.send(meeting);
      })
      .catch((error) => {
        res.send(error);
      });
  };
}
