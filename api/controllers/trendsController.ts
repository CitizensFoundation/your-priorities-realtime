import express from "express";
//import Post from './post.interface';
const { Client } = require("@elastic/elasticsearch");

import { models } from "../models";

export class TrendsController {
  public path = "/api/trends";
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path + "/getProjects", this.getProjects);
    //    this.router.post(this.path, this.createAPost);
  }

  getProjects = async (
    request: express.Request,
    response: express.Response
  ) => {

    models.Project.findAll({
      where: {
        id: 1
      }
    }).then( projects => {
      models.User.create({
        name: "Robert",
        email: "robert@citizens.is",
        encrypedPassword: "dksaodksaodskos",
        ypUserId: 1
      }).then( user => {
        response.send(user)
      }).catch( error => {
        response.send(error);
      })
    });
  }
}
