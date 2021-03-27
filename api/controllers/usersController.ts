import express from "express";
import { IGNORE } from "sequelize/types/lib/index-hints";
import { models } from "../models";

export class UsersController {
  public path = "/api/users";
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path + "/:id/loginFromToken", this.loginFromToken);
    this.router.post(this.path + "/login", this.login);
    this.router.get(this.path + "/checkLogin", this.checkLogin);
  }

  login = async (req: express.Request, res: express.Response) => {
    const user = {
      name: "Anonymous",
      selectedAvatar: req.body.userAvatar,
      selectedAvatarColor: req.body.userAvatarColor,
      language: req.body.language ? req.body.language : 'en'
    } as UserAttributes

    try {
      const savedUser = models.User.create(user)
       // @ts-ignore
      req.session.user = savedUser;
      res.send(savedUser);
    } catch (error) {
      console.error(error);
      res.send(error);
    }
  }

  checkLogin = async (req: express.Request, res: express.Response) => {
     // @ts-ignore
     if (req.session.user) {
       // @ts-ignore
       res.send(req.session.user);
    } else {
      res.sendStatus(200);
    }
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
