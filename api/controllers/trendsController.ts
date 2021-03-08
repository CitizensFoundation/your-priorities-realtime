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
      console.log(projects);
      response.send(projects);
    }).catch( error => {
      console.error(error);
      response.sendStatus(500);
    });
  };

  createAPost = (request: express.Request, response: express.Response) => {
    //    const post: Post = request.body;
    //    this.posts.push(post);
    //    response.send(post);
  };
}
