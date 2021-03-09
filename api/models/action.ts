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

interface ActionCreationAttributes extends Optional<ActionAttributes, "id"> {}

export class Action
  extends Model<ActionAttributes, ActionCreationAttributes>
  implements ActionAttributes {
  public id!: number;
  public description!: string;
  public language!: string;
  public actionPlanId!: number;
  public userId!: number;
  public state!: number;
  public completeBy!: number;
  public completedPercent!: number;
  public assignedToType?: number;
  public assignedToName?: string;


  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public readonly completedAt?: Date;
}

export const InitAction = (sequelize: Sequelize) => {
  Action.init(
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
      actionPlanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: new DataTypes.STRING,
        allowNull: false,
      },
      state: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      completeBy: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      completedPercent: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      language: {
        type: new DataTypes.STRING(10),
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
      tableName: "actions",
      sequelize
    }
  );

  return Action;
}
