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
        this.logout = async (req, res) => {
            try {
                // @ts-ignore
                if (req.session.user) {
                    // @ts-ignore
                    req.session.user = undefined;
                    await req.session.save();
                }
                res.sendStatus(200);
            }
            catch (error) {
                console.error(error);
                res.send(error);
            }
        };
        this.login = async (req, res) => {
            const user = {
                name: req.body.userName || "Anonymous",
                selectedAvatar: req.body.userAvatar,
                selectedAvatarColor: req.body.userAvatarColor,
                language: req.body.language ? req.body.language : 'en'
            };
            try {
                const savedUser = await models_1.models.User.create(user);
                // @ts-ignore
                req.session.user = savedUser;
                await req.session.save();
                res.send(savedUser);
            }
            catch (error) {
                console.error(error);
                res.send(error);
            }
        };
        this.checkLogin = async (req, res) => {
            // @ts-ignore
            if (req.session.user) {
                // @ts-ignore
                res.send(req.session.user);
            }
            else {
                res.sendStatus(200);
            }
        };
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
        this.router.delete(this.path + "/logout", this.logout);
    }
}
exports.UsersController = UsersController;
