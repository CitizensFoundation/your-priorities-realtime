import express from 'express';
import bodyParser from 'body-parser';
import * as path from 'path';
import * as url from 'url';
const { Client } = require('@elastic/elasticsearch');

export class App {
  public app: express.Application;
  public esClient: typeof Client;
  public port: number;

  constructor(controllers: Array<any>, port: number) {
    this.app = express();
    this.port =  parseInt(process.env.PORT || "8000");

    if (process.env.NODE_ENV=== 'development') {
      this.esClient = new Client({
        node: 'https://search-pace-dev-1-jv4lkhrngfqvb3wiwkrcvpsr7m.us-east-1.es.amazonaws.com'
      })
//      this.esClient = new Client({ node: 'http://localhost:9200' })
    } else if (process.env.QUOTAGUARDSTATIC_URL) {
      this.esClient = new Client({
        node: 'https://search-pace-dev-1-jv4lkhrngfqvb3wiwkrcvpsr7m.us-east-1.es.amazonaws.com',
        proxy:  process.env.QUOTAGUARDSTATIC_URL
      })
      console.log("USING QUOTAGUARD_URL")
    } else  {
      this.esClient = new Client({
        node: 'https://search-pace-dev-1-jv4lkhrngfqvb3wiwkrcvpsr7m.us-east-1.es.amazonaws.com'
      })
    }

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
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

    this.app.use(bodyParser.json());
    this.app.use(express.static(path.join(__dirname, '/../web-app/dist')));
  }

  private initializeControllers(controllers: Array<any>) {
    controllers.forEach((controller) => {
      controller.setEsClient(this.esClient);
      this.app.use('/', controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}
