"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
class UsersController {
    constructor() {
        this.path = "/api/users";
        this.router = express_1.default.Router();
        //TODO: Complete this
        this.loginFromToken = async (req, res) => {
            models_1.models.User.findOne({
                attributes: { exclude: ["encrypedPassword"] },
            })
                .then((user) => {
                res.send(user);
            })
                .catch((error) => {
                res.send(error);
            });
        };
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get(this.path + "/:id/loginFromToken", this.loginFromToken);
        this.router.post(this.path + "/login", this.login);
        this.router.get(this.path + "/checkLogin", this.checkLogin);
    }
}
exports.UsersController = UsersController;
