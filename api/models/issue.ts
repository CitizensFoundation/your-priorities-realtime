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

import { Round } from './round';

interface IssueCreationAttributes extends Optional<IssueAttributes, "id"> {}

export class Issue
  extends Model<IssueAttributes, IssueCreationAttributes>
  implements IssueAttributes {
  public id!: number;
  public roundId!: number;
  public userId!: number;
  public description!: string;
  public language!: string;
  public type!: number;
  public state!: number;
  public counterUpVotes!: number;
  public counterDownVotes!: number;
  public publicData!: IssuePublicDataAttributes | null;

  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public readonly staredAt?: Date;
  public readonly completedAt?: Date;
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
