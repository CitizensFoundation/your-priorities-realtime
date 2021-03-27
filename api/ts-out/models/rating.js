"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitRating = exports.Rating = void 0;
const sequelize_1 = require("sequelize");
class Rating extends sequelize_1.Model {
}
exports.Rating = Rating;
const InitRating = (sequelize) => {
    Rating.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        issueId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        roundId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        value: {
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
        tableName: "ratings",
        sequelize,
        indexes: [
            {
                name: "rating_main_index",
                fields: ["issueId", "roundId", "deletedAt"],
            },
        ],
    });
    return Rating;
};
exports.InitRating = InitRating;
