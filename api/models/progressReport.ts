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

interface ProgressReportCreationAttributes extends Optional<ProgressReportAttributes, "id"> {}

export class ProgressReport
  extends Model<ProgressReportAttributes, ProgressReportCreationAttributes>
  implements ProgressReportAttributes {
  public id!: number;
  public actionId!: number;
  public userId!: number;
  public content!: string;
  public language?: string;
  public timeFrame!: number;

  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
}

export const InitProgressReport = (sequelize: Sequelize) => {
  ProgressReport.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      actionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      timeFrame: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: new DataTypes.STRING,
        allowNull: false,
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
      tableName: "progressReports",
      sequelize
    }
  );

  return ProgressReport;
}
