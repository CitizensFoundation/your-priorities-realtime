"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeetingsController = void 0;
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
class MeetingsController {
    constructor() {
        this.path = "/api/meetings";
        this.router = express_1.default.Router();
        this.getMeeting = async (req, res) => {
            models_1.models.Meeting.findOne({
                where: {
                    id: req.params.id,
                },
                include: [
                    {
                        model: models_1.models.Round,
                        as: "Round"
                    }
                ],
                attributes: { exclude: ["privateData"] },
            })
                .then((meeting) => {
                res.send(meeting);
            })
                .catch((error) => {
                console.error(error);
                res.send(error);
            });
        };
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get(this.path + "/:id", this.getMeeting);
    }
}
exports.MeetingsController = MeetingsController;
