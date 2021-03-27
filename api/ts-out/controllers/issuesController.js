"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssuesController = void 0;
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
class IssuesController {
    constructor() {
        this.path = "/api/issues";
        this.router = express_1.default.Router();
        this.setSelectedStatus = async (req, res) => {
            models_1.models.Issue.findOne({
                where: {
                    id: req.params.id
                },
            }).then(async (issue) => {
                if (issue) {
                    if (req.body.checked == true) {
                        issue.selected = true;
                        await issue.save();
                        res.sendStatus(200);
                    }
                    else {
                        issue.selected = false;
                        await issue.save();
                        res.sendStatus(200);
                    }
                }
                else {
                    res.sendStatus(404);
                }
            }).catch(error => {
                res.send(error);
            });
        };
        this.vote = async (req, res) => {
            models_1.models.Issue.findOne({
                where: {
                    id: req.params.id
                },
            }).then(async (issue) => {
                if (issue) {
                    if (req.body.value == 1) {
                        await issue.increment("counterUpVotes");
                        res.sendStatus(200);
                    }
                    else {
                        await issue.increment("counterDownVotes");
                        res.sendStatus(200);
                    }
                }
                else {
                    res.sendStatus(404);
                }
            }).catch(error => {
                res.send(error);
            });
        };
        this.deleteRating = async (req, res) => {
            try {
                await models_1.models.Rating.destroy({
                    where: {
                        issueId: req.params.id,
                        roundId: req.body.roundId
                    }
                });
                res.sendStatus(200);
            }
            catch (error) {
                console.error(error);
                res.send(error);
            }
        };
        this.rate = async (req, res) => {
            try {
                let rating = await models_1.models.Rating.findOne({
                    where: {
                        issueId: req.params.id,
                        roundId: req.body.roundId
                    }
                });
                if (!rating) {
                    rating = await models_1.models.Rating.create({
                        issueId: parseInt(req.params.id),
                        roundId: req.body.roundId,
                        userId: 1,
                        value: req.body.value
                    });
                }
                else {
                    rating.value = req.body.value;
                    await rating.save();
                }
                res.sendStatus(200);
            }
            catch (error) {
                console.error(error);
                res.send(error);
            }
        };
        this.addAction = async (req, res) => {
            models_1.models.ActionPlan.create().then(actionPlan => {
                req.body.actionPlanId = actionPlan.id;
                models_1.models.Action.create(req.body).then(action => {
                    res.send(action);
                }).catch(error => {
                    res.send(error);
                });
            });
        };
        this.addRating = async (req, res) => {
            models_1.models.Rating.create(req.body).then(project => {
                res.send(project);
            }).catch(error => {
                res.send(error);
            });
        };
        this.addComment = async (req, res) => {
            models_1.models.Comment.create(req.body).then(project => {
                res.send(project);
            }).catch(error => {
                res.send(error);
            });
        };
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.post(this.path + "/:id/addComment", this.addComment);
        this.router.post(this.path + "/:id/addAction", this.addAction);
        this.router.post(this.path + "/:id/vote", this.vote);
        this.router.post(this.path + "/:id/rate", this.rate);
        this.router.delete(this.path + "/:id/rate", this.deleteRating);
        this.router.put(this.path + "/:id/setSelectedStatus", this.setSelectedStatus);
    }
}
exports.IssuesController = IssuesController;
