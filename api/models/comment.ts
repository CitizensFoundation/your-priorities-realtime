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

interface CommentCreationAttributes extends Optional<CommentAttributes, "id"> {}

export class Comment
  extends Model<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes {
  public id!: number;
  public roundId!: number;
  public issueId!: number;
  public actionId!: number;
  public userId!: number;
  public content!: string;
  public language!: string;
  public type!: number;
  public status!: number;
  public counterUpVotes!: number;
  public counterDownVotes!: number;
  public publicData!: CommentPublicDataAttributes | null;
  public privateData!: CommentPrivateDataAttributes | null;

  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public readonly staredAt?: Date;
  public readonly completedAt?: Date;
}

export const InitComment = (sequelize: Sequelize) => {
  Comment.init(
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
      issueId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      actionId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      content: {
        type: new DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
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
      tableName: "comments",
      sequelize
    }
  );

  return Comment;
}
