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

import { Project } from './project';
import { Stage } from './stage';

interface RoundCreationAttributes extends Optional<RoundAttributes, "id"> {}

export class Round
  extends Model<RoundAttributes, RoundCreationAttributes>
  implements RoundAttributes {
  public id!: number;
  public userId!: number;
  public projectId!: number;
  public publicData!: RoundPublicDataAttributes | null;

  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public readonly staredAt?: Date;
  public readonly completedAt?: Date;

  public getStage!: HasManyGetAssociationsMixin<Stage>; // Note the null assertions!
  public addStage!: HasManyAddAssociationMixin<Stage, number>;

  public readonly stages?: Stage[];

  public static associations: {
    stages: Association<Round, Stage>
  };
}

export const InitRound = (sequelize: Sequelize) => {
  Round.init(
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
      projectId: {
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
      startedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      completedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      }
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "rounds",
      sequelize
    }
  );

  return Round;
}
