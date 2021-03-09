"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitEmailCampaign = exports.EmailCampaign = void 0;
const sequelize_1 = require("sequelize");
class EmailCampaign extends sequelize_1.Model {
}
exports.EmailCampaign = EmailCampaign;
const InitEmailCampaign = (sequelize) => {
    EmailCampaign.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        stageId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        language: {
            type: new sequelize_1.DataTypes.STRING(10),
            allowNull: true,
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        sentAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        }
    }, {
        timestamps: true,
        paranoid: true,
        tableName: "emailCampaigns",
        sequelize
    });
    return EmailCampaign;
};
exports.InitEmailCampaign = InitEmailCampaign;
