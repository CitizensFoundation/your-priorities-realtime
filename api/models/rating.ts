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

interface RatingCreationAttributes extends Optional<RatingAttributes, "id"> {}

export class Rating
  extends Model<RatingAttributes, RatingCreationAttributes>
  implements RatingAttributes {
  public id!: number;
  public roundId!: number;
  public issueId!: number;
  public userType!: 1 | 2;
  public userId!: number;
  public value!: number;

  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
}

export const InitRating = (sequelize: Sequelize) => {
  Rating.init(
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
      issueId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userType: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      roundId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      value: {
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
      tableName: "ratings",
      sequelize,
      indexes: [
        {
          name: "rating_main_index",
          fields: ["issueId","roundId","deletedAt"],
        },
      ],
    }
  );

  return Rating;
}
