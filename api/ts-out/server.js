"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { models } = require('./models');
const app_1 = require("./app");
const roundsController_1 = require("./controllers/roundsController");
const projectsController_1 = require("./controllers/projectsController");
const meetingsController_1 = require("./controllers/meetingsController");
const usersController_1 = require("./controllers/usersController");
const issuesController_1 = require("./controllers/issuesController");
const actionsController_1 = require("./controllers/actionsController");
const commentsController_1 = require("./controllers/commentsController");
const app = new app_1.App([
    new roundsController_1.RoundsController(),
    new projectsController_1.ProjectsController(),
    new meetingsController_1.MeetingsController(),
    new usersController_1.UsersController(),
    new issuesController_1.IssuesController(),
    new actionsController_1.ActionsController(),
    new commentsController_1.CommentsController()
], 8000);
app.listen();
