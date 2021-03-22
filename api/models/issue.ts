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

import { Comment } from './comment';
import { Action } from './action';

interface IssueCreationAttributes extends Optional<IssueAttributes, "id"> {}

export class Issue
  extends Model<IssueAttributes, IssueCreationAttributes>
  implements IssueAttributes {
  public id!: number;
  public roundId!: number;
  public projectId!: number;
  public userId!: number;
  public description!: string;
  public language!: string;
  public type!: number;
  public state!: number;
  public counterUpVotes!: number;
  public counterDownVotes!: number;
  public publicData!: IssuePublicDataAttributes | null;
  public privateData!: IssuePrivateDataAttributes | null;

  public getComment!: HasManyGetAssociationsMixin<Comment>; // Note the null assertions!
  public addComment!: HasManyAddAssociationMixin<Comment, number>;

  public getAction!: HasManyGetAssociationsMixin<Action>; // Note the null assertions!
  public addAction!: HasManyAddAssociationMixin<Action, number>;

  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public readonly staredAt?: Date;
  public readonly completedAt?: Date;

  public static associations: {
    Comments: Association<Issue, Comment>,
    Actions: Association<Issue, Action>,
  };

  static TypeCoreIssue = 0;
}

export const InitIssue = (sequelize: Sequelize) => {
  Issue.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      roundId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: new DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      counterUpVotes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      counterDownVotes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      language: {
        type: new DataTypes.STRING(10),
        allowNull: true,
      },
      publicData: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      privateData: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      state: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "issues",
      sequelize
    }
  );

  return Issue;
}
