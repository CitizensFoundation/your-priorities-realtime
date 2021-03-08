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
                models_1.models.User.create({
                    name: "Robert",
                    email: "robert@citizens.is",
                    language: "en",
                    encrypedPassword: "dksaodksaodskos",
                    ypUserId: 1
                }).then(user => {
                    models_1.models.Role.create({
                        translationNameToken: "community",
                    }).then(role => {
                        user.addRole(role).then(userWithRole => {
                            response.send(userWithRole);
                        });
                    });
                }).catch(error => {
                    response.send(error);
                });
            });
        };
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get(this.path + "/getProjects", this.getProjects);
        //    this.router.post(this.path, this.createAPost);
    }
}
exports.TrendsController = TrendsController;
