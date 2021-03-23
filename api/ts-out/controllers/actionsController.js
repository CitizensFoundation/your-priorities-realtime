"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionsController = void 0;
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
class ActionsController {
    constructor() {
        this.path = "/api/actions";
        this.router = express_1.default.Router();
        this.vote = async (req, res) => {
            models_1.models.Action.findOne({
                where: {
                    id: req.params.id
                },
            }).then(async (action) => {
                if (action) {
                    if (req.body.value == 1) {
                        await action.increment("counterUpVotes");
                        res.sendStatus(200);
                    }
                    else {
                        await action.increment("counterDownVotes");
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
        this.addAction = async (req, res) => {
            models_1.models.Action.create(req.body).then(action => {
                res.send(action);
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
        this.router.post(this.path + "/:id/vote", this.vote);
    }
}
exports.ActionsController = ActionsController;