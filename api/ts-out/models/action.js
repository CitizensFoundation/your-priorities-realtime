"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitAction = exports.Action = void 0;
const sequelize_1 = require("sequelize");
class Action extends sequelize_1.Model {
}
exports.Action = Action;
const InitAction = (sequelize) => {
    Action.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        actionPlanId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        assignedTo: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
        },
        selected: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        state: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        completeBy: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true
        },
        completedPercent: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
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
        tableName: "actions",
        sequelize
    });
    return Action;
};
exports.InitAction = InitAction;
