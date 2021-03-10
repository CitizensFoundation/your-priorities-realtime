import {
  Sequelize,
  Model,
  ModelDefined,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  Association,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Optional,
} from "sequelize";

import { User } from "./user";
import { Round } from "./round";

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

  public getUser!: HasManyGetAssociationsMixin<User>; // Note the null assertions!
  public addUser!: HasManyAddAssociationMixin<User, number>;

  // You can also pre-declare possible inclusions, these will only be populated if you
  // actively include a relation.
  public readonly rounds?: Round[]; // Note this is optional since it's only populated when explicitly requested in code
  public readonly users?: User[]; // Note this is optional since it's only populated when explicitly requested in code

  public static associations: {
    rounds: Association<Project, Round>,
    users: Association<Project, User>
  };
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
