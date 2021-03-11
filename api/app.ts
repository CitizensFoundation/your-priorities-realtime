import express from 'express';
import bodyParser from 'body-parser';
import * as path from 'path';
import * as url from 'url';

export class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: Array<any>, port: number) {
    this.app = express();
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
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}
