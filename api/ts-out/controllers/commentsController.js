"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsController = void 0;
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
class CommentsController {
    constructor() {
        this.path = "/api/comments";
        this.router = express_1.default.Router();
        this.vote = async (req, res) => {
            models_1.models.Comment.findOne({
                where: {
                    id: req.params.id
                },
            }).then(async (comment) => {
                if (comment) {
                    if (req.body.value == 1) {
                        await comment.increment("counterUpVotes");
                        res.send(comment);
                    }
                    else {
                        await comment.increment("counterDownVotes");
                        res.send(comment);
                    }
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
        this.router.put(this.path + "/:id/vote", this.vote);
    }
}
exports.CommentsController = CommentsController;
