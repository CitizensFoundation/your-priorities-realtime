"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitSentEmail = exports.SentEmail = void 0;
const sequelize_1 = require("sequelize");
class SentEmail extends sequelize_1.Model {
}
exports.SentEmail = SentEmail;
const InitSentEmail = (sequelize) => {
    SentEmail.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        emailCampaignId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        loginCode: {
            type: new sequelize_1.DataTypes.STRING(1024),
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
        clickedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        clickCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        timestamps: true,
        paranoid: true,
        tableName: "sentEmails",
        sequelize,
    });
    return SentEmail;
};
exports.InitSentEmail = InitSentEmail;
