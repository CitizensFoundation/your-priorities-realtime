"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitUser = exports.User = void 0;
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
}
exports.User = User;
const InitUser = (sequelize) => {
    User.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: new sequelize_1.DataTypes.STRING(256),
            allowNull: false,
        },
        email: {
            type: new sequelize_1.DataTypes.STRING(256),
            allowNull: true,
            unique: true
        },
        language: {
            type: new sequelize_1.DataTypes.STRING(10),
            allowNull: false,
        },
        selectedAvatar: {
            type: new sequelize_1.DataTypes.STRING(256),
            allowNull: true,
        },
        selectedAvatarColor: {
            type: new sequelize_1.DataTypes.STRING(64),
            allowNull: true,
        },
        encrypedPassword: {
            type: new sequelize_1.DataTypes.STRING(2048),
            allowNull: false,
        },
        ypUserId: {
            type: new sequelize_1.DataTypes.INTEGER,
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
        tableName: "users",
        sequelize
    });
    return User;
};
exports.InitUser = InitUser;
