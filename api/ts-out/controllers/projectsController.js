"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsController = void 0;
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
class ProjectsController {
    constructor() {
        this.path = "/api/projects";
        this.router = express_1.default.Router();
        this.createProject = async (req, res) => {
            models_1.models.Project.create(req.body).then(project => {
                res.send(project);
            }).catch(error => {
                res.send(error);
            });
        };
        this.getProject = async (req, res) => {
            models_1.models.Project.findAll({
                where: {
                    id: req.params.id
                },
                include: [
                    {
                        model: models_1.models.Round,
                        as: "Rounds"
                    }
                ]
            }).then(project => {
                res.send(project);
            }).catch(error => {
                res.send(error);
            });
        };
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.post(this.path, this.createProject);
        this.router.get(this.path + "/:id", this.getProject);
    }
}
exports.ProjectsController = ProjectsController;
