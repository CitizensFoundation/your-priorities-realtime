"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitScoreCard = exports.ScoreCard = void 0;
const sequelize_1 = require("sequelize");
class ScoreCard extends sequelize_1.Model {
}
exports.ScoreCard = ScoreCard;
const InitScoreCard = (sequelize) => {
    ScoreCard.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        roundId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        state: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        type: {
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
        tableName: "scoreCards",
        sequelize
    });
    return ScoreCard;
};
exports.InitScoreCard = InitScoreCard;
