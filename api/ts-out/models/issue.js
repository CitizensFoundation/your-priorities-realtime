"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitIssue = exports.Issue = void 0;
const sequelize_1 = require("sequelize");
class Issue extends sequelize_1.Model {
}
exports.Issue = Issue;
Issue.TypeCoreIssue = 0;
const InitIssue = (sequelize) => {
    Issue.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        roundId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        projectId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        description: {
            type: new sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        counterUpVotes: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        counterDownVotes: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        score: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        language: {
            type: new sequelize_1.DataTypes.STRING(10),
            allowNull: true,
        },
        publicData: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        privateData: {
            type: sequelize_1.DataTypes.JSONB,
            allowNull: true,
        },
        state: {
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
        }
    }, {
        timestamps: true,
        paranoid: true,
        tableName: "issues",
        sequelize
    });
    return Issue;
};
exports.InitIssue = InitIssue;
