"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitIssue = exports.Issue = void 0;
const sequelize_1 = require("sequelize");
class Issue extends sequelize_1.Model {
}
exports.Issue = Issue;
Issue.TypeCoreIssue = 0;
Issue.IssueTypes = {
    CoreIssue: 0,
    UserIssue: 1,
    ProviderIssue: 2,
    AllIssues: -1,
};
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
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        imageUrl: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: true,
        },
        standard: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        type: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        selected: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
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
