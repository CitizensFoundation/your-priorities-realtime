"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueController = void 0;
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
class IssueController {
    constructor() {
        this.path = "/api/issues";
        this.router = express_1.default.Router();
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
        this.router.post(this.path + "/:id/vote", this.vote);
    }
}
exports.IssueController = IssueController;
