"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitRole = exports.Role = void 0;
const sequelize_1 = require("sequelize");
class Role extends sequelize_1.Model {
}
exports.Role = Role;
const InitRole = (sequelize) => {
    Role.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        translationNameToken: {
            type: new sequelize_1.DataTypes.STRING(256),
            allowNull: false,
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
        tableName: "roles",
        sequelize,
    });
    return Role;
};
exports.InitRole = InitRole;
