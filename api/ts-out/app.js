"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const path = __importStar(require("path"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const redis = require("redis");
let redisClient;
if (process.env.REDIS_URL) {
    redisClient = redis.createClient(process.env.REDIS_URL, {
        tls: {
            rejectUnauthorized: false
        }
    });
}
else {
    redisClient = redis.createClient({
        url: "redis://localhost:6379"
    });
}
const app = express_1.default();
const httpServer = http_1.createServer(app);
const io = new socket_io_1.Server(httpServer, {});
io.on("connection", (socket) => {
    const meetingId = socket.handshake.query.meetingId;
    if (meetingId) {
        const redisMeetingStateKey = `meetingStateV2${meetingId}`;
        redisClient.get(redisMeetingStateKey, (error, reply) => {
            const parsedLatestMeetingState = JSON.parse(reply);
            console.log(parsedLatestMeetingState);
            if (parsedLatestMeetingState) {
                socket.emit("meetingState", parsedLatestMeetingState);
                console.log("Sending last meeting state");
            }
        });
        socket.join(meetingId);
        socket.on("meetingState", (meetingState) => {
            console.log(meetingState);
            socket.in(meetingId).emit("meetingState", meetingState);
            if (meetingState.isLive === false) {
                redisClient.del(redisMeetingStateKey);
            }
            else {
                console.log("Saving last meeting state");
                console.log(meetingState);
                redisClient.setex(redisMeetingStateKey, 60 * 60 * 2, JSON.stringify(meetingState), redis.print);
            }
        });
        socket.on("newComment", (newComment) => {
            console.log(newComment);
            socket.in(meetingId).emit("newComment", newComment);
        });
        socket.on("newIssue", (newIssue) => {
            console.log(newIssue);
            socket.in(meetingId).emit("newIssue", newIssue);
        });
        socket.on("newAction", (newAction) => {
            console.log(newAction);
            socket.in(meetingId).emit("newAction", newAction);
        });
    }
    else {
        console.error("No meeting id from socket");
    }
});
const session = require('express-session');
let RedisStore = require('connect-redis')(session);
class App {
    constructor(controllers, port) {
        this.app = app;
        this.port = parseInt(process.env.PORT || "8000");
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }
    initializeMiddlewares() {
        this.app.use(body_parser_1.default.json());
        this.app.use(express_1.default.static(path.join(__dirname, '/../../cs-web-app/dist')));
        this.app.use('/project*', express_1.default.static(path.join(__dirname, '/../../cs-web-app/dist')));
        this.app.use('/round*', express_1.default.static(path.join(__dirname, '/../../cs-web-app/dist')));
        this.app.use('/meeting*', express_1.default.static(path.join(__dirname, '/../../cs-web-app/dist')));
        this.app.use('/info*', express_1.default.static(path.join(__dirname, '/../../cs-web-app/dist')));
        app.use(session({
            store: new RedisStore({ client: redisClient }),
            secret: process.env.SESSION_SECRET ? process.env.SESSION_SECRET : 'not so secret... use env var.',
            resave: false,
            saveUninitialized: false
        }));
        if (process.env.NODE_ENV !== 'development' && !process.env.DISABLE_FORCE_HTTPS) {
            this.app.enable('trust proxy');
            this.app.use(function checkProtocol(req, res, next) {
                console.log(`Protocol ${req.protocol}`);
                if (!/https/.test(req.protocol)) {
                    res.redirect("https://" + req.headers.host + req.url);
                }
                else {
                    return next();
                }
            });
        }
    }
    initializeControllers(controllers) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }
    listen() {
        httpServer.listen(this.port, () => {
            console.log(`App listening on the port ${this.port}`);
        });
    }
}
exports.App = App;
