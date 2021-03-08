"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrendsController = void 0;
const express_1 = __importDefault(require("express"));
//import Post from './post.interface';
const { Client } = require("@elastic/elasticsearch");
const models_1 = require("../models");
class TrendsController {
    constructor() {
        this.path = "/api/trends";
        this.router = express_1.default.Router();
        this.getProjects = async (request, response) => {
            models_1.models.Project.findAll({
                where: {
                    id: 1
                }
            }).then(projects => {
                console.log(projects);
                response.send(projects);
            }).catch(error => {
                console.error(error);
                response.sendStatus(500);
            });
        };
        this.createAPost = (request, response) => {
            //    const post: Post = request.body;
            //    this.posts.push(post);
            //    response.send(post);
        };
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get(this.path + "/getProjects", this.getProjects);
        //    this.router.post(this.path, this.createAPost);
    }
}
exports.TrendsController = TrendsController;
