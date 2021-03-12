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
    }
}
exports.IssueController = IssueController;
