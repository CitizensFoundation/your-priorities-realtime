"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitProject = exports.Project = void 0;
const sequelize_1 = require("sequelize");
class Project extends sequelize_1.Model {
}
exports.Project = Project;
const InitProject = (sequelize) => {
    Project.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: new sequelize_1.DataTypes.STRING(256),
            allowNull: false,
        },
        language: {
            type: new sequelize_1.DataTypes.STRING(10),
            allowNull: true,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        publicData: {
            type: sequelize_1.DataTypes.JSONB,
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
    }, {
        timestamps: true,
        paranoid: true,
        tableName: "projects",
        sequelize,
    });
    return Project;
};
exports.InitProject = InitProject;
