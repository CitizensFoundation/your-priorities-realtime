import { InitUser } from "./user";
import { InitProject } from "./project";
import { InitRole } from "./role";
import { InitRound } from "./round";
import { InitStage } from "./stage";
import { InitStory } from "./story";
import { InitMeeting } from "./meeting";
import { InitEmailCampaign } from "./emailCampaign";
import { InitSentEmail } from "./sentEmail";
import { InitIssue } from "./issue";
import { InitActionPlan } from "./actionPlan";


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
  Stage: InitStage(sequelize),
  Story: InitStory(sequelize),
  Meeting: InitMeeting(sequelize),
  EmailCampaign: InitEmailCampaign(sequelize),
  SentEmail: InitSentEmail(sequelize),
  Issue: InitIssue(sequelize),
  ActionPlan: InitActionPlan(sequelize)
};

// Associations

// Project
models.Project.hasMany(models.Round, {
  sourceKey: "id",
  foreignKey: "projectId",
  as: "rounds",
});

models.Project.belongsTo(models.User,  { as: 'User', foreignKey: 'userId' });

// User
models.User.hasMany(models.Project, {
  sourceKey: "id",
  foreignKey: "userId",
  as: "projects"
});

models.User.belongsToMany(models.Role, {
  through: 'UserRoles'
});

models.User.belongsToMany(models.Project, {
  through: 'ProjectUsers'
});

models.User.hasMany(models.Role, {
  sourceKey: "id",
  foreignKey: "userId",
  as: "roles"
});

// Round
models.Round.belongsTo(models.Project,  { as: 'Project', foreignKey: 'projectId' });

models.Round.hasMany(models.Stage, {
  sourceKey: "id",
  foreignKey: "roundId",
  as: "stages"
});

models.Round.hasMany(models.Issue, {
  sourceKey: "id",
  foreignKey: "roundId",
  as: "issues"
});

// Stage
models.Stage.belongsTo(models.Round,  { as: 'Round', foreignKey: 'roundId' });

// Story
models.Stage.belongsTo(models.Project,  { as: 'Project', foreignKey: 'projectId' });

models.Story.belongsToMany(models.EmailCampaign, {
  through: 'EmailCampaignStories'
});

models.Story.belongsToMany(models.Stage, {
  through: 'StageStories'
});

// Meeting
models.Meeting.belongsTo(models.Stage,  { as: 'Project', foreignKey: 'stageId' });

// EmailCampaign
models.EmailCampaign.hasMany(models.SentEmail, {
  sourceKey: "id",
  foreignKey: "emailCampaignId",
  as: "sentEmails"
});

// SentEmail
models.SentEmail.belongsTo(models.EmailCampaign,  { as: 'EmailCampaign', foreignKey: 'emailCampaignId' });

// Issue
models.Issue.belongsTo(models.Round,  { as: 'Round', foreignKey: 'roundId' });

sequelize.sync({force: true});
