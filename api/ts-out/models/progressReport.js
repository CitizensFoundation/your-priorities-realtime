"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitProgressReport = exports.ProgressReport = void 0;
const sequelize_1 = require("sequelize");
class ProgressReport extends sequelize_1.Model {
}
exports.ProgressReport = ProgressReport;
const InitProgressReport = (sequelize) => {
    ProgressReport.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        actionId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        timeFrame: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        content: {
            type: new sequelize_1.DataTypes.STRING,
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
        }
    }, {
        timestamps: true,
        paranoid: true,
        tableName: "progressReports",
        sequelize
    });
    return ProgressReport;
};
exports.InitProgressReport = InitProgressReport;
