"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitStory = exports.Story = void 0;
const sequelize_1 = require("sequelize");
class Story extends sequelize_1.Model {
}
exports.Story = Story;
const InitStory = (sequelize) => {
    Story.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        projectId: {
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
        startedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        completedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        }
    }, {
        timestamps: true,
        paranoid: true,
        tableName: "stories",
        sequelize
    });
    return Story;
};
exports.InitStory = InitStory;
