"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitRound = exports.Round = void 0;
const sequelize_1 = require("sequelize");
class Round extends sequelize_1.Model {
}
exports.Round = Round;
const InitRound = (sequelize) => {
    Round.init({
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
        }
    }, {
        timestamps: true,
        paranoid: true,
        tableName: "rounds",
        sequelize
    });
    return Round;
};
exports.InitRound = InitRound;
