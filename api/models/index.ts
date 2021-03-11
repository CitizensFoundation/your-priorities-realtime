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
import { InitAction } from "./action";
import { InitScoreCard } from "./scoreCard";
import { InitComment } from "./comment";
import { InitProgressReport } from "./progressReport";
import { KeyObject } from "crypto";


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
  ActionPlan: InitActionPlan(sequelize),
  Action: InitAction(sequelize),
  ScoreCard: InitScoreCard(sequelize),
  Comment: InitComment(sequelize),
  ProgressReport: InitProgressReport(sequelize)
};

// Associations

// Project
models.Project.hasMany(models.Round, {
  sourceKey: "id",
  foreignKey: "projectId",
  as: "Rounds",
});

models.Project.belongsTo(models.User,  { as: 'User', foreignKey: 'userId' });

// User
/*models.User.hasMany(models.Project, {
  sourceKey: "id",
  foreignKey: "userId",
  as: "Projects"
});*/

models.User.belongsToMany(models.Role, {
  through: 'UserRoles'
});

models.User.belongsToMany(models.Project, {
  through: 'ProjectUsers'
});

models.User.hasMany(models.Role, {
  sourceKey: "id",
  foreignKey: "userId",
  as: "UserRoles"
});

// Round
models.Round.belongsTo(models.Project,  { as: 'Project', foreignKey: 'projectId' });

models.Round.hasMany(models.Stage, {
  sourceKey: "id",
  foreignKey: "roundId",
  as: "Stages"
});

models.Round.hasMany(models.Issue, {
  sourceKey: "id",
  foreignKey: "roundId",
  as: "Issues"
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
  as: "SentEmails"
});

// SentEmail
models.SentEmail.belongsTo(models.EmailCampaign,  { as: 'EmailCampaign', foreignKey: 'emailCampaignId' });

// Issue
models.Issue.belongsTo(models.Round,  { as: 'Round', foreignKey: 'roundId' });

models.Issue.belongsToMany(models.ScoreCard, {
  through: 'ScoreCardIssues'
});

// ActionPlan
models.ActionPlan.hasMany(models.Action, {
  sourceKey: "id",
  foreignKey: "actionPlanId",
  as: "Actions"
});

// Action
models.Action.belongsTo(models.ActionPlan,  { as: 'ActionPlan', foreignKey: 'actionPlanId' });

// ScoreCard

// Comment
models.Comment.belongsToMany(models.Issue, {
  through: 'IssueComments'
});

models.Comment.belongsToMany(models.Action, {
  through: 'ActionComments'
});

// ProgressReport
models.ProgressReport.belongsTo(models.Action,  { as: 'Action', foreignKey: 'actionId' });

sequelize.sync({force: true});

setTimeout( ()=>{
  (async () => {

    try {
      const user = await models.User.create({
        name: "Robert Bjarnason",
        email: "robert@citizens.is",
        encrypedPassword: "dsDSDJWD)dw9jdw9d92",
        language:"en"
      });

      const roleNames = ["users","providers","workingGroup","facilitator"];
      const allRoles = [];
      for (let i=0;i<roleNames.length;i++) {
        const role = await models.Role.create({
          nameToken: roleNames[i],
        });
        allRoles.push(role);
      }

      await user.addRole(allRoles[3]);

      const project = await  models.Project.create({
        name: "Test Project",
        description: "This is a test project",
        userId: user.id,
        language: "en",
        publicData: {
          service: "",
          locations: "",
          keyContacts: "123",
          languages: "ru,en,ky"
        }
      });

      await user.addProject(project);
    } catch (error) {
      console.error(error);
    }
  })();
}, 2000);

