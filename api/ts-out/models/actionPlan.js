"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitActionPlan = exports.ActionPlan = void 0;
const sequelize_1 = require("sequelize");
class ActionPlan extends sequelize_1.Model {
}
exports.ActionPlan = ActionPlan;
const InitActionPlan = (sequelize) => {
    ActionPlan.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
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
        tableName: "action_plans",
        sequelize,
    });
    return ActionPlan;
};
exports.InitActionPlan = InitActionPlan;
