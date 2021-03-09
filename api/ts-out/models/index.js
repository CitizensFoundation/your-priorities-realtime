"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.models = void 0;
const user_1 = require("./user");
const project_1 = require("./project");
const role_1 = require("./role");
const round_1 = require("./round");
const stage_1 = require("./stage");
const story_1 = require("./story");
const meeting_1 = require("./meeting");
const emailCampaign_1 = require("./emailCampaign");
const sentEmail_1 = require("./sentEmail");
const issue_1 = require("./issue");
const actionPlan_1 = require("./actionPlan");
const action_1 = require("./action");
const scoreCard_1 = require("./scoreCard");
const comment_1 = require("./comment");
const progressReport_1 = require("./progressReport");
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
    Stage: stage_1.InitStage(sequelize),
    Story: story_1.InitStory(sequelize),
    Meeting: meeting_1.InitMeeting(sequelize),
    EmailCampaign: emailCampaign_1.InitEmailCampaign(sequelize),
    SentEmail: sentEmail_1.InitSentEmail(sequelize),
    Issue: issue_1.InitIssue(sequelize),
    ActionPlan: actionPlan_1.InitActionPlan(sequelize),
    Action: action_1.InitAction(sequelize),
    ScoreCard: scoreCard_1.InitScoreCard(sequelize),
    Comment: comment_1.InitComment(sequelize),
    ProgressReport: progressReport_1.InitProgressReport(sequelize)
};
// Associations
// Project
exports.models.Project.hasMany(exports.models.Round, {
    sourceKey: "id",
    foreignKey: "projectId",
    as: "Rounds",
});
exports.models.Project.belongsTo(exports.models.User, { as: 'User', foreignKey: 'userId' });
// User
exports.models.User.hasMany(exports.models.Project, {
    sourceKey: "id",
    foreignKey: "userId",
    as: "Projects"
});
exports.models.User.belongsToMany(exports.models.Role, {
    through: 'UserRoles'
});
exports.models.User.belongsToMany(exports.models.Project, {
    through: 'ProjectUsers'
});
exports.models.User.hasMany(exports.models.Role, {
    sourceKey: "id",
    foreignKey: "userId",
    as: "UserRoles"
});
// Round
exports.models.Round.belongsTo(exports.models.Project, { as: 'Project', foreignKey: 'projectId' });
exports.models.Round.hasMany(exports.models.Stage, {
    sourceKey: "id",
    foreignKey: "roundId",
    as: "Stages"
});
exports.models.Round.hasMany(exports.models.Issue, {
    sourceKey: "id",
    foreignKey: "roundId",
    as: "Issues"
});
// Stage
exports.models.Stage.belongsTo(exports.models.Round, { as: 'Round', foreignKey: 'roundId' });
// Story
exports.models.Stage.belongsTo(exports.models.Project, { as: 'Project', foreignKey: 'projectId' });
exports.models.Story.belongsToMany(exports.models.EmailCampaign, {
    through: 'EmailCampaignStories'
});
exports.models.Story.belongsToMany(exports.models.Stage, {
    through: 'StageStories'
});
// Meeting
exports.models.Meeting.belongsTo(exports.models.Stage, { as: 'Project', foreignKey: 'stageId' });
// EmailCampaign
exports.models.EmailCampaign.hasMany(exports.models.SentEmail, {
    sourceKey: "id",
    foreignKey: "emailCampaignId",
    as: "SentEmails"
});
// SentEmail
exports.models.SentEmail.belongsTo(exports.models.EmailCampaign, { as: 'EmailCampaign', foreignKey: 'emailCampaignId' });
// Issue
exports.models.Issue.belongsTo(exports.models.Round, { as: 'Round', foreignKey: 'roundId' });
exports.models.Issue.belongsToMany(exports.models.ScoreCard, {
    through: 'ScoreCardIssues'
});
// ActionPlan
exports.models.ActionPlan.hasMany(exports.models.Action, {
    sourceKey: "id",
    foreignKey: "actionPlanId",
    as: "Actions"
});
// Action
exports.models.Action.belongsTo(exports.models.ActionPlan, { as: 'ActionPlan', foreignKey: 'actionPlanId' });
// ScoreCard
// Comment
exports.models.Comment.belongsToMany(exports.models.Issue, {
    through: 'IssueComments'
});
exports.models.Comment.belongsToMany(exports.models.Action, {
    through: 'ActionComments'
});
// ProgressReport
exports.models.ProgressReport.belongsTo(exports.models.Action, { as: 'Action', foreignKey: 'actionId' });
sequelize.sync({ force: true });
