const { models } = require('./models');
import { App } from './app';
import { RoundsController } from './controllers/roundsController';
import { ProjectsController } from './controllers/projectsController';
import { MeetingsController } from './controllers/meetingsController';
import { UsersController } from './controllers/usersController';
import { IssueController } from './controllers/issueController';

const app = new App(
  [
    new RoundsController(),
    new ProjectsController(),
    new MeetingsController(),
    new UsersController(),
    new IssueController()
  ],
  8000,
);

app.listen();