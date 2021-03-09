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

// Some attributes are optional in `User.build` and `User.create` calls
interface SentEmailCreationAttributes
  extends Optional<SentEmailAttributes, "id"> {}

export class SentEmail
  extends Model<SentEmailAttributes, SentEmailCreationAttributes>
  implements SentEmailAttributes {
  public id!: number;
  public loginCode!: string;
  public userId!: number;
  public emailCampaignId!: number;
  public clickCount!: number;

  // timestamps!
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public readonly clickedAt?: Date;
}

export const InitSentEmail = (sequelize: Sequelize) => {
  SentEmail.init(
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
      emailCampaignId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      loginCode: {
        type: new DataTypes.STRING(1024),
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
      clickedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      clickCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "sentEmails",
      sequelize,
    }
  );

  return SentEmail;
};
