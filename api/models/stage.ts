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

interface StageCreationAttributes extends Optional<StageAttributes, "id"> {}

export class Stage
  extends Model<StageAttributes, StageCreationAttributes>
  implements StageAttributes {
  public id!: number;
  public roundId!: number;
  public nameToken!: string;
  public type!: number;
  public audience!: number;
  public status!: number;

  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public readonly staredAt?: Date;
  public readonly completedAt?: Date;
}

export const InitStage = (sequelize: Sequelize) => {
  Stage.init(
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
      nameToken: {
        type: new DataTypes.STRING(256),
        allowNull: false,
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      audience: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
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
      tableName: "stages",
      sequelize
    }
  );

  return Stage;
}
