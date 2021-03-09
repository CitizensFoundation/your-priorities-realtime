"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitMeeting = exports.Meeting = void 0;
const sequelize_1 = require("sequelize");
class Meeting extends sequelize_1.Model {
}
exports.Meeting = Meeting;
const InitMeeting = (sequelize) => {
    Meeting.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        stageId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        type: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        state: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        subState: {
            type: sequelize_1.DataTypes.INTEGER,
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
        startedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        },
        completedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
        }
    }, {
        timestamps: true,
        paranoid: true,
        tableName: "meetings",
        sequelize
    });
    return Meeting;
};
exports.InitMeeting = InitMeeting;
