import express from "express";
import { models } from "../models";

export class UsersController {
  public path = "/api/users";
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path + "/:id/loginFromToken", this.loginFromToken);
  }

  //TODO: Complete this
  loginFromToken = async (req: express.Request, res: express.Response) => {
    models.User.findOne({
      attributes: { exclude: ["encrypedPassword"] },
    })
      .then((user) => {
        res.send(user);
      })
      .catch((error) => {
        res.send(error);
      });
  };
}
