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

interface EmailCampaignCreationAttributes extends Optional<EmailCampaignAttributes, "id"> {}

export class EmailCampaign
  extends Model<EmailCampaignAttributes, EmailCampaignCreationAttributes>
  implements EmailCampaignAttributes {
  public id!: number;
  public stageId!: number;
  public userId!: number;
  public language!: string;

  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public readonly sentAt?: Date;

  public getSentEmail!: HasManyGetAssociationsMixin<SentEmail>; // Note the null assertions!
  public addSentEmail!: HasManyAddAssociationMixin<SentEmail, number>;

  public readonly sentEmails?: SentEmail[];

  public static associations: {
    sentEmails: Association<EmailCampaign, SentEmail>
  };
}

export const InitEmailCampaign = (sequelize: Sequelize) => {
  EmailCampaign.init(
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
      stageId: {
        type: DataTypes.INTEGER,
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
      },
      sentAt: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "emailCampaigns",
      sequelize
    }
  );

  return EmailCampaign;
}
