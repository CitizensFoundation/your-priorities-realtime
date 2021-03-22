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

import { User } from "./user";
import { models } from ".";
import ModelManager from "sequelize/types/lib/model-manager";
const { Translate } = require("@google-cloud/translate").v2;

// Some attributes are optional in `User.build` and `User.create` calls
interface TranslationCacheCreationAttributes
  extends Optional<TranslationCacheAttributes, "id"> {}

export class TranslationCache
  extends Model<TranslationCacheAttributes, TranslationCacheCreationAttributes>
  implements TranslationCacheAttributes {
  public id!: number;
  public indexKey!: string;
  public content!: string;

  // timestamps!
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  public static async getTranslationFromGoogle(
    textType: string,
    indexKey: string,
    contentToTranslate: string,
    targetLanguage: string,
    modelInstance: Model
  ) {
    return await new Promise(async (resolve, reject) => {
      if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
        const translateAPI = new Translate({
          credentials: JSON.parse(
            process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
          ),
        });

        const results = await translateAPI.translate(
          contentToTranslate,
          targetLanguage
        );
        const translationResults = results[1];
        if (
          translationResults &&
          translationResults.data &&
          translationResults.data.translations &&
          translationResults.data.translations.length > 0
        ) {
          const translation = translationResults.data.translations[0];
          models.TranslationCache.create({
            indexKey: indexKey,
            content: translation.translatedText,
          })
            .then(() => {
              modelInstance
                .update({
                  language: translation.detectedSourceLanguage,
                })
                .then(() => {
                  resolve({ content: translation.translatedText });
                })
                .catch((error: string) => {
                  reject(error);
                });
            })
            .catch((error: string) => {
              reject(error);
            });
        } else {
          reject("No api");
        }
      }
    });
  }

  public static fixUpLanguage(targetLanguage: string) {
    targetLanguage = targetLanguage.replace("_", "-");

    if (
      targetLanguage !== "sr-latin" &&
      targetLanguage !== "zh-CN" &&
      targetLanguage !== "zh-TW"
    ) {
      targetLanguage = targetLanguage.split("-")[0];
    }

    if (targetLanguage === "sr-latin") {
      targetLanguage = "sr-Latn";
    }

    return targetLanguage;
  }
}

export const InitTranslationCache = (sequelize: Sequelize) => {
  TranslationCache.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      indexKey: {
        type: new DataTypes.STRING(256),
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
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
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "translationCache",
      sequelize,
      indexes: [
        {
          name: "main_index",
          fields: ["indexKey"],
        },
      ],
    }
  );

  return TranslationCache;
};
