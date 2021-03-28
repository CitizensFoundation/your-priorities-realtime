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
import { InitTranslationCache } from "./translationCache";
import { InitRating } from "./rating";

const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  });
} else {
  const config = require(`${__dirname}/../../config/config.json`)[env];
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

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
  ProgressReport: InitProgressReport(sequelize),
  TranslationCache: InitTranslationCache(sequelize),
  Rating: InitRating(sequelize),
};

// Associations

// Project
models.Project.hasMany(models.Round, {
  sourceKey: "id",
  foreignKey: "projectId",
  as: "Rounds",
});

//models.Project.belongsTo(models.User,  { as: 'User', foreignKey: 'userId' });

models.Project.belongsToMany(models.User, {
  through: "ProjectUsers",
});

// User
/*models.User.hasMany(models.Project, {
  sourceKey: "id",
  foreignKey: "userId",
  as: "Projects"
});*/

models.User.belongsToMany(models.Role, {
  through: "UserRoles",
});

models.User.belongsToMany(models.Project, {
  through: "ProjectUsers",
});

models.User.hasMany(models.Role, {
  sourceKey: "id",
  foreignKey: "userId",
  as: "UserRoles",
});

models.User.hasMany(models.Comment, {
  sourceKey: "id",
  foreignKey: "userId",
});

// Round
models.Round.belongsTo(models.Project, {
  as: "Project",
  foreignKey: "projectId",
});

models.Round.hasMany(models.Meeting, {
  sourceKey: "id",
  foreignKey: "roundId",
  as: "Meetings",
});

models.Round.hasMany(models.Issue, {
  sourceKey: "id",
  foreignKey: "roundId",
  as: "Issues",
});

models.Round.hasMany(models.Rating, {
  sourceKey: "id",
  foreignKey: "roundId",
  as: "Ratings",
});

// Stage
models.Stage.belongsTo(models.Round, { as: "Round", foreignKey: "roundId" });

// Story
models.Stage.belongsTo(models.Project, {
  as: "Project",
  foreignKey: "projectId",
});

models.Story.belongsToMany(models.EmailCampaign, {
  through: "EmailCampaignStories",
});

models.Story.belongsToMany(models.Stage, {
  through: "StageStories",
});

// Meeting
models.Meeting.belongsTo(models.Round, { as: "Round", foreignKey: "roundId" });

// EmailCampaign
models.EmailCampaign.hasMany(models.SentEmail, {
  sourceKey: "id",
  foreignKey: "emailCampaignId",
  as: "SentEmails",
});

// SentEmail
models.SentEmail.belongsTo(models.EmailCampaign, {
  as: "EmailCampaign",
  foreignKey: "emailCampaignId",
});

// Issue
models.Issue.belongsTo(models.Round, { as: "Round", foreignKey: "roundId" });

models.Issue.belongsToMany(models.ScoreCard, {
  through: "ScoreCardIssues",
});

models.Issue.hasMany(models.Comment, {
  sourceKey: "id",
  foreignKey: "issueId",
});

models.Issue.hasMany(models.Action, {
  sourceKey: "id",
  foreignKey: "issueId",
});

models.Issue.hasMany(models.Rating, {
  sourceKey: "id",
  foreignKey: "issueId",
  as: "Ratings"
});

// ActionPlan
/*models.ActionPlan.hasMany(models.Action, {
  sourceKey: "id",
  foreignKey: "actionPlanId",
  as: "Actions",
});*/

// Action
models.Action.belongsTo(models.Issue, { as: "Issue", foreignKey: "issueId" });

/*models.Action.belongsTo(models.ActionPlan, {
  as: "ActionPlan",
  foreignKey: "actionPlanId",
});*/

// ScoreCard

// Comment

models.Comment.belongsTo(models.Issue, { as: "Issue", foreignKey: "issueId" });
models.Comment.belongsTo(models.Action, {
  as: "Action",
  foreignKey: "actionId",
});
models.Comment.belongsTo(models.User, { as: "User", foreignKey: "userId" });

// ProgressReport
models.ProgressReport.belongsTo(models.Action, {
  as: "Action",
  foreignKey: "actionId",
});

// Rating
models.Rating.belongsTo(models.Issue, { as: "Issue", foreignKey: "issueId" });

const force = true;

if (force) {
  sequelize.sync({ force });

  setTimeout(() => {
    (async () => {
      try {
        const user = await models.User.create({
          name: "Robert Bjarnason",
          email: "robert@citizens.is",
          encrypedPassword: "dsDSDJWD)dw9jdw9d92",
          language: "en",
        });

        const roleNames = ["users", "providers", "workingGroup", "facilitator"];
        const allRoles = [];
        for (let i = 0; i < roleNames.length; i++) {
          const role = await models.Role.create({
            nameToken: roleNames[i],
          });
          allRoles.push(role);
        }

        await user.addRole(allRoles[3]);

        const project = await models.Project.create({
          name: "Test Project",
          description: "This is a test project",
          userId: user.id,
          language: "en",
          publicData: {
            service: "Health services",
            locations: "Bosnia",
            keyContacts: "somebody@somewhere.bi",
            languages: "Bosnian, Croatian, Serbian & English",
          },
        });

        await user.addProject(project);

        const round = await models.Round.create({
          projectId: project.id,
          userId: user.id,
        });

        const coreIssues = [
          "Attitude of staff",
          "Affordability of services",
          "Availability of medicine",
          "Distance to health centre",
          "Equal access to health services for all community members",
          "Punctuality of staff",
          "Polite behavior",
          "Listening to patients' problems",
          "Honest and transparent staff (in terms of dealing with drugs, food, etc)",
        ];

        const standards = [
          "Staff on duty (XX per population) during working hours to provide you with the care that meets your needs",
          "Staff attending the health center on time and being present all dayOut of hours standards: 24 hour standby duty for emergencies with publicly posted contact information and schedule",
          "Access to medicines: 12 drug deliveries per year to your health center ensure there is enough medicine for treatment",
          "Care for women: Pregnancy and newborn screening",
          "Care for the elderly",
          "Staff attending the health center on time and being present all dayOut of hours standards: 24 hour standby duty for emergencies with publicly posted contact information and schedule",
          "Access to medicines: 12 drug deliveries per year to your health center ensure there is enough medicine for treatment",
          "Care for women: Pregnancy and newborn screening",
          "Care for the elderly",
        ]

        for (let i=0;i<coreIssues.length;i++) {
          const issue = {
            description: coreIssues[i],
            standard: standards[i],
            userId: 1,
            type: 0,
            state: 0,
            roundId: round.id,
            projectId: project.id,
          } as IssueAttributes;

          await models.Issue.create(issue);
        }

        const roundPublicData = {
          meetings: {},
        } as RoundPublicDataAttributes;

        const userOrentationMeeting = await models.Meeting.create({
          roundId: round.id,
          type: models.Meeting.TypeOrientation,
          state: 0,
          subState: 0,
          forUsers: true,
          forServiceProviders: false,
          userId: user.id,
        });

        roundPublicData.meetings["userOrentationMeeting"] =
          userOrentationMeeting.id;

        const providerOrentationMeeting = await models.Meeting.create({
          roundId: round.id,
          type: models.Meeting.TypeOrientation,
          state: 0,
          subState: 0,
          forUsers: false,
          forServiceProviders: true,
          userId: user.id,
        });

        roundPublicData.meetings["providerOrentationMeeting"] =
          providerOrentationMeeting.id;

        const userCreateCardMeeting = await models.Meeting.create({
          roundId: round.id,
          type: models.Meeting.TypeCreateCard,
          state: 0,
          subState: 0,
          forUsers: true,
          forServiceProviders: false,
          userId: user.id,
        });

        roundPublicData.meetings["userCreateCardMeeting"] =
          userCreateCardMeeting.id;

        const providerCreateCardMeeting = await models.Meeting.create({
          roundId: round.id,
          type: models.Meeting.TypeCreateCard,
          state: 0,
          subState: 0,
          forUsers: false,
          forServiceProviders: true,
          userId: user.id,
        });

        roundPublicData.meetings["providerCreateCardMeeting"] =
          providerCreateCardMeeting.id;

        const userScoringMeeting = await models.Meeting.create({
          roundId: round.id,
          type: models.Meeting.TypeScoring,
          state: 0,
          subState: 0,
          forUsers: true,
          forServiceProviders: false,
          userId: user.id,
        });

        roundPublicData.meetings["userScoringMeeting"] = userScoringMeeting.id;

        const providerScoringMeeting = await models.Meeting.create({
          roundId: round.id,
          type: models.Meeting.TypeScoring,
          state: 0,
          subState: 0,
          forUsers: false,
          forServiceProviders: true,
          userId: user.id,
        });

        roundPublicData.meetings["providerScoringMeeting"] =
          providerScoringMeeting.id;

        const actionPlanMeeting = await models.Meeting.create({
          roundId: round.id,
          type: models.Meeting.TypeActionPlan,
          state: 0,
          subState: 0,
          forUsers: true,
          forServiceProviders: true,
          userId: user.id,
        });

        roundPublicData.meetings["actionPlanMeeting"] = actionPlanMeeting.id;

        round.publicData = roundPublicData;

        await round.save();
      } catch (error) {
        console.error(error);
      }
    })();
  }, 700);
} else {
  sequelize.sync({});
}
