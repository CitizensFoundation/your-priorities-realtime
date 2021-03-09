"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { models } = require('./models');
const app_1 = require("./app");
const roundsController_1 = require("./controllers/roundsController");
const projectsController_1 = require("./controllers/projectsController");
const app = new app_1.App([
    new roundsController_1.RoundsController(),
    new projectsController_1.ProjectsController()
], 8000);
app.listen();
