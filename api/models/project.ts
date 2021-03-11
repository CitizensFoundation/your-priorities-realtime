import {
  Sequelize,
  Model,
  ModelDefined,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  BelongsToManyAddAssociationMixin,
  Association,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Optional,
  BelongsToManyGetAssociationsMixinOptions,
  BelongsToManyGetAssociationsMixin,
} from "sequelize";

import express from "express";

import { User } from "./user";
import { Round } from "./round";
import { models } from ".";

// Some attributes are optional in `Project.build` and `Project.create` calls
interface ProjectCreationAttributes extends Optional<ProjectAttributes, "id"> {}

export class Project
  extends Model<ProjectAttributes, ProjectCreationAttributes>
  implements ProjectAttributes {
  public id!: number;
  public userId!: number;
  public name!: string;
  public description!: string;
  public language!: string | null;
  public publicData!: ProjectPublicDataAttributes | null;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public getRound!: HasManyGetAssociationsMixin<Round>; // Note the null assertions!
  public addRound!: HasManyAddAssociationMixin<Round, number>;

  public getUser!: BelongsToManyGetAssociationsMixin<User>; // Note the null assertions!
  public addUser!: BelongsToManyAddAssociationMixin<User, number>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  public readonly Rounds?: Round[]; // Note this is optional since it's only populated when explicitly requested in code
  public readonly Users?: User[]; // Note this is optional since it's only populated when explicitly requested in code

  public static associations: {
    Rounds: Association<Project, Round>,
    Users: Association<Project, User>
  };

  public static async addParticipants(body: ParticipantsUploadAttributes, res: express.Response) {
    const lines = body.participants.split("\n");
    const roleId = body.roleId+1;
    const language = body.language;
    const projectId = body.projectId;

    try {
      const role = await models.Role.findOne({
        where: {
          id: roleId
        }
      })
      for (let i=0; i<lines.length;i++) {
        if (lines[i].length>10) {
          const splitLine = lines[i].split(",")
          const email = splitLine[0];
          const name = splitLine[1];
          const user = await models.User.create({
            name,
            email,
            language,
            encrypedPassword: "12345"
          });

          await user.addRole(role!);

          console.error("pr "+projectId);

          const project = await models.Project.findOne({
            where: {
              id: projectId
            }
          })

          if (!project) {
            res.sendStatus(404);
            break;
          } else {
            user.addProject(project);
          }
        }
      }

      res.sendStatus(200);
    } catch(error) {
      console.error(error);
      res.sendStatus(500);
    }
  }
}

export const InitProject = (sequelize: Sequelize) => {
  Project.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: new DataTypes.STRING(256),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      language: {
        type: new DataTypes.STRING(10),
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      publicData: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "projects",
      sequelize,
    }
  );

  return Project
};
