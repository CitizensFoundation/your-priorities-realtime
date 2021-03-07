"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const trendsController_1 = require("./controllers/trendsController");
const app = new app_1.App([
    new trendsController_1.TrendsController(),
], 8000);
app.listen();
