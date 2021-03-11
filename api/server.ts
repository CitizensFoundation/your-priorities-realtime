const { models } = require('./models');
import { App } from './app';
import { RoundsController } from './controllers/roundsController';
import { ProjectsController } from './controllers/projectsController';
import { MeetingsController } from './controllers/meetingsController';

const app = new App(
  [
    new RoundsController(),
    new ProjectsController(),
    new MeetingsController()
  ],
  8000,
);

app.listen();