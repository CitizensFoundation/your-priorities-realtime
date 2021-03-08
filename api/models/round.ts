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

interface RoundCreationAttributes extends Optional<RoundAttributes, "id"> {}

export class Round
  extends Model<RoundAttributes, RoundCreationAttributes>
  implements RoundAttributes {
  public id!: number;
  public userId!: number;
  public projectId!: number;
  public publicData!: RoundPublicDataAttributes | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const InitRound = (sequelize: Sequelize) => {
  Round.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
      },
      projectId: {
        type: DataTypes.INTEGER.UNSIGNED,
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
      }
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "rounds",
      sequelize
    }
  );

  Round.belongsTo(Project);

  return Round;
}
