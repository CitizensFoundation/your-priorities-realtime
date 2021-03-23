import express from 'express';
import bodyParser from 'body-parser';
import * as path from 'path';
import * as url from 'url';
import { createServer } from "http";
import { Server, Socket } from "socket.io";
const redis = require("redis");

const redisUrl = process.env.REDIS_URL ? process.env.REDIS_URL : "redis://localhost:6379";

/*const redisClient = redis.createClient({
  url: redisUrl
});*/

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {});

io.on("connection", (socket) => {

  const meetingId = socket.handshake.query.meetingId;

  if (meetingId) {
    const redisMeetingStateKey = `meetingState${meetingId}`;
    /*redisClient.get(redisMeetingStateKey, (error: string, reply: any) => {
      const parsedLatestMeetingState = JSON.parse(reply);
      console.log(parsedLatestMeetingState);

      if (parsedLatestMeetingState) {
        socket.emit("meetingState", parsedLatestMeetingState);
        console.log("Sending last meeting state");
      }
    });*/

    socket.join(meetingId);

    socket.on("meetingState", (meetingState: StateAttributes) => {
      console.log(meetingState);
      socket.in(meetingId).emit("meetingState", meetingState)
      if (meetingState.isLive===false) {
        //redisClient.del(redisMeetingStateKey);
      } else {
        console.log("Saving last meeting state");
        console.log(meetingState);
        //redisClient.set(redisMeetingStateKey, JSON.stringify(meetingState), redis.print);
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
  } else {
    console.error("No meeting id from socket");
  }
});

export class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: Array<any>, port: number) {
    this.app = app;
    this.port =  parseInt(process.env.PORT || "8000");

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(express.static(path.join(__dirname, '/../../cs-web-app/dist')));

    this.app.use('/project*', express.static(path.join(__dirname, '/../../cs-web-app/dist')));
    this.app.use('/round*', express.static(path.join(__dirname, '/../../cs-web-app/dist')));
    this.app.use('/meeting*', express.static(path.join(__dirname, '/../../cs-web-app/dist')));

    if (process.env.NODE_ENV !== 'development' && !process.env.DISABLE_FORCE_HTTPS) {
      this.app.enable('trust proxy');
      this.app.use(function checkProtocol (req, res, next) {
        console.log(`Protocol ${req.protocol}`)
        if (!/https/.test(req.protocol)) {
          res.redirect("https://" + req.headers.host + req.url);
        } else {
          return next();
        }
      });
    }
  }

  private initializeControllers(controllers: Array<any>) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  public listen() {
    httpServer.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}
