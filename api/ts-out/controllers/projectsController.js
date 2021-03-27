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
            models_1.models.Project.findOne({
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
            console.error(req.params.issueType);
            if (req.params.issueType == -1) {
                models_1.models.Issue.findAll({
                    where: {
                        projectId: req.params.id
                    },
                    include: [
                        {
                            model: models_1.models.Comment,
                            include: [
                                {
                                    model: models_1.models.User,
                                    as: "User",
                                    attributes: ["id", "selectedAvatar", "selectedAvatarColor"]
                                }
                            ]
                        },
                        {
                            model: models_1.models.Action
                        }
                    ]
                }).then(project => {
                    res.send(project);
                }).catch(error => {
                    console.error(error);
                    res.send(error);
                });
            }
            else {
                models_1.models.Issue.findAll({
                    where: {
                        projectId: req.params.id,
                        type: req.params.issueType != "-1" ? req.params.issueType : undefined
                    },
                    include: [
                        {
                            model: models_1.models.Comment,
                            include: [
                                {
                                    model: models_1.models.User,
                                    as: "User",
                                    attributes: ["id", "selectedAvatar", "selectedAvatarColor"]
                                }
                            ]
                        }
                    ]
                }).then(project => {
                    res.send(project);
                }).catch(error => {
                    console.error(error);
                    res.send(error);
                });
            }
        };
        this.getParticipants = async (req, res) => {
            models_1.models.Project.findOne({
                where: {
                    id: req.params.id
                },
                attributes: ['id'],
                include: [
                    {
                        model: models_1.models.User,
                        attributes: { exclude: ['encrypedPassword'] },
                        include: [
                            {
                                model: models_1.models.Role,
                            }
                        ]
                    }
                ]
            }).then(project => {
                if (project) {
                    res.send(project.Users);
                }
                else {
                    res.sendStatus(404);
                }
            }).catch(error => {
                console.error(error);
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
        this.router.get(this.path + "/:id/participants", this.getParticipants);
        this.router.get(this.path + "/:id/issues/:issueType", this.getIssues);
    }
}
exports.ProjectsController = ProjectsController;
