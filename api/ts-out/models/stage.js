"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitStage = exports.Stage = void 0;
const sequelize_1 = require("sequelize");
class Stage extends sequelize_1.Model {
}
exports.Stage = Stage;
const InitStage = (sequelize) => {
    Stage.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        roundId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        nameToken: {
            type: new sequelize_1.DataTypes.STRING(256),
            allowNull: false,
        },
        type: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        audience: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
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
        tableName: "stages",
        sequelize
    });
    return Stage;
};
exports.InitStage = InitStage;
