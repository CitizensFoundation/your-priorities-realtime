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
        this.addIssue = async (req, res) => {
            models_1.models.Issue.create(req.body).then(issue => {
                res.send(issue);
            }).catch(error => {
                res.send(error);
            });
        };
        this.addParticipants = async (req, res) => {
            models_1.models.Project.addParticipants(req.body, res);
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
        this.getIssues = async (req, res) => {
            models_1.models.Issue.findAll({
                where: {
                    projectId: req.params.id,
                    type: req.params.issueType
                }
            }).then(project => {
                res.send(project);
            }).catch(error => {
                res.send(error);
            });
        };
        this.getParticipants = async (req, res) => {
            models_1.models.User.findAll({
                attributes: { exclude: ['encryptedPassword'] },
                include: [
                    {
                        model: models_1.models.Project,
                        as: "ProjectUsers",
                        attributes: ['id'],
                        where: {
                            ProjectId: req.params.id
                        }
                    }
                ]
            }).then(users => {
                res.send(users);
            }).catch(error => {
                res.send(error);
            });
        };
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.post(this.path, this.createProject);
        this.router.post(this.path + "/:id/addParticipants", this.addParticipants);
        this.router.post(this.path + "/:id/addIssue", this.addIssue);
        this.router.get(this.path + "/:id", this.getProject);
        this.router.get(this.path + "/:id/getParticipants", this.getParticipants);
        this.router.get(this.path + "/:id/issues/:issueType", this.getIssues);
    }
}
exports.ProjectsController = ProjectsController;
