"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.models = void 0;
const user_1 = require("./user");
const project_1 = require("./project");
const role_1 = require("./role");
const round_1 = require("./round");
const stage_1 = require("./stage");
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require(`${__dirname}/../../config/config.json`)[env];
const sequelize = new Sequelize(config.database, config.username, config.password, config);
exports.models = {
    sequelize,
    Sequelize,
    Role: role_1.InitRole(sequelize),
    Project: project_1.InitProject(sequelize),
    User: user_1.InitUser(sequelize),
    Round: round_1.InitRound(sequelize),
    Stage: stage_1.InitStage(sequelize)
};
// Associations
// Project
exports.models.Project.hasMany(exports.models.Round, {
    sourceKey: "id",
    foreignKey: "projectId",
    as: "rounds",
});
exports.models.Project.belongsTo(exports.models.User, { as: 'User', foreignKey: 'userId' });
// User
exports.models.User.hasMany(exports.models.Project, {
    sourceKey: "id",
    foreignKey: "userId",
    as: "projects"
});
exports.models.User.belongsToMany(exports.models.Role, {
    through: 'UserRoles'
});
exports.models.User.belongsToMany(exports.models.Project, {
    through: 'UserProjects'
});
exports.models.User.hasMany(exports.models.Role, {
    sourceKey: "id",
    foreignKey: "userId",
    as: "roles"
});
// Round
exports.models.Round.belongsTo(exports.models.Project, { as: 'Project', foreignKey: 'projectId' });
exports.models.Round.hasMany(exports.models.Stage, {
    sourceKey: "id",
    foreignKey: "roundId",
    as: "stages"
});
// Stage
exports.models.Stage.belongsTo(exports.models.Round, { as: 'Round', foreignKey: 'roundId' });
sequelize.sync({ force: true });
