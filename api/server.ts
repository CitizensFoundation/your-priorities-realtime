const { models } = require('./models');
import { App } from './app';
import { RoundsController } from './controllers/roundsController';
import { ProjectsController } from './controllers/projectsController';
import { MeetingsController } from './controllers/meetingsController';
import { UsersController } from './controllers/usersController';
import { IssuesController } from './controllers/issuesController';
import { ActionsController } from './controllers/actionsController';

const app = new App(
  [
    new RoundsController(),
    new ProjectsController(),
    new MeetingsController(),
    new UsersController(),
    new IssuesController(),
    new ActionsController()
  ],
  8000,
);

app.listen();