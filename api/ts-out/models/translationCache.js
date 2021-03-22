"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitTranslationCache = exports.TranslationCache = void 0;
const sequelize_1 = require("sequelize");
const _1 = require(".");
const { Translate } = require("@google-cloud/translate").v2;
class TranslationCache extends sequelize_1.Model {
    static async getTranslationFromGoogle(textType, indexKey, contentToTranslate, targetLanguage, modelInstance) {
        return await new Promise(async (resolve, reject) => {
            if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
                const translateAPI = new Translate({
                    credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON),
                });
                const results = await translateAPI.translate(contentToTranslate, targetLanguage);
                const translationResults = results[1];
                if (translationResults &&
                    translationResults.data &&
                    translationResults.data.translations &&
                    translationResults.data.translations.length > 0) {
                    const translation = translationResults.data.translations[0];
                    _1.models.TranslationCache.create({
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
                            .catch((error) => {
                            reject(error);
                        });
                    })
                        .catch((error) => {
                        reject(error);
                    });
                }
                else {
                    reject("No api");
                }
            }
        });
    }
    static fixUpLanguage(targetLanguage) {
        targetLanguage = targetLanguage.replace("_", "-");
        if (targetLanguage !== "sr-latin" &&
            targetLanguage !== "zh-CN" &&
            targetLanguage !== "zh-TW") {
            targetLanguage = targetLanguage.split("-")[0];
        }
        if (targetLanguage === "sr-latin") {
            targetLanguage = "sr-Latn";
        }
        return targetLanguage;
    }
}
exports.TranslationCache = TranslationCache;
const InitTranslationCache = (sequelize) => {
    TranslationCache.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        indexKey: {
            type: new sequelize_1.DataTypes.STRING(256),
            allowNull: false,
        },
        content: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
    }, {
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
    });
    return TranslationCache;
};
exports.InitTranslationCache = InitTranslationCache;
