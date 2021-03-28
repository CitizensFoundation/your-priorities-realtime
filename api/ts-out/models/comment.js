"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitComment = exports.Comment = void 0;
const sequelize_1 = require("sequelize");
class Comment extends sequelize_1.Model {
}
exports.Comment = Comment;
const InitComment = (sequelize) => {
    Comment.init({
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
        issueId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        actionId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        content: {
            type: new sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        type: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
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
        tableName: "comments",
        sequelize
    });
    return Comment;
};
exports.InitComment = InitComment;
