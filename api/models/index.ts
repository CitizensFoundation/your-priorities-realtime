import { InitUser } from "./user";
import { InitProject } from "./project";
import { InitRole } from "./role";
import { InitRound } from "./round";

const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require(`${__dirname}/../../config/config.json`)[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

export const models = {
  sequelize,
  Sequelize,
  Role: InitRole(sequelize),
  Project: InitProject(sequelize),
  User: InitUser(sequelize),
  Round: InitRound(sequelize),
};

// Associations
models.Project.hasMany(models.Round, {
  sourceKey: "id",
  foreignKey: "projectId",
  as: "rounds",
});

models.Project.belongsTo(models.User,  { as: 'User', foreignKey: 'userId' });

models.User.hasMany(models.Project, {
  sourceKey: "id",
  foreignKey: "userId",
  as: "projects"
});

models.User.belongsToMany(models.Role, {
  through: 'UserRoles'
});

models.User.hasMany(models.Role, {
  sourceKey: "id",
  foreignKey: "userId",
  as: "roles"
});

models.Round.belongsTo(models.Project,  { as: 'Project', foreignKey: 'projectId' });

sequelize.sync({force: true});
