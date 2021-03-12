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

interface MeetingCreationAttributes extends Optional<MeetingAttributes, "id"> {}

export class Meeting
  extends Model<MeetingAttributes, MeetingCreationAttributes>
  implements MeetingAttributes {
  public id!: number;
  public roundId!: number;
  public userId!: number;
  public type!: number;
  public state!: number;
  public subState!: number;
  public forUsers!: boolean;
  public forServiceProviders!: boolean;

  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public readonly staredAt?: Date;
  public readonly completedAt?: Date;

  static TypeOrientation = 0;
  static TypeCreateCard = 1;
  static TypeScoring = 2;
  static TypeActionPlan = 3;
  static TypeReporting = 4;
}

export const InitMeeting = (sequelize: Sequelize) => {
  Meeting.init(
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
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      state: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subState: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      forUsers: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      forServiceProviders: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
      tableName: "meetings",
      sequelize
    }
  );

  return Meeting;
}
