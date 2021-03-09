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

import { SentEmail } from './sentEmail';

interface ScoreCardCreationAttributes extends Optional<ScoreCardAttributes, "id"> {}

export class ScoreCard
  extends Model<ScoreCardAttributes, ScoreCardCreationAttributes>
  implements ScoreCardAttributes {
  public id!: number;
  public roundId!: number;
  public state!: number;
  public type!: number;

  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
}

export const InitScoreCard = (sequelize: Sequelize) => {
  ScoreCard.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      roundId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      state: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
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
      tableName: "scoreCards",
      sequelize
    }
  );

  return ScoreCard;
}
