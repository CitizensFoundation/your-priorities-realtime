"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoundsController = void 0;
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
class RoundsController {
    constructor() {
        this.path = "/api/rounds";
        this.router = express_1.default.Router();
        this.createRound = async (req, res) => {
            models_1.models.Round.create(req.body).then(project => {
                res.send(project);
            }).catch(error => {
                res.send(error);
            });
        };
        this.getRound = async (req, res) => {
            models_1.models.Round.findOne({
                where: {
                    id: req.params.id,
                },
                attributes: { exclude: ['privateData'] }
            }).then(round => {
                res.send(round);
            }).catch(error => {
                res.send(error);
            });
        };
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.post(this.path, this.createRound);
        this.router.get(this.path + "/:id", this.getRound);
    }
}
exports.RoundsController = RoundsController;
