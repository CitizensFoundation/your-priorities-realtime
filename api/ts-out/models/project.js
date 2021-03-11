"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitProject = exports.Project = void 0;
const sequelize_1 = require("sequelize");
const _1 = require(".");
class Project extends sequelize_1.Model {
    static async addParticipants(body, res) {
        const lines = body.participants.split("\n");
        const roleId = body.roleId + 1;
        const language = body.language;
        const projectId = body.projectId;
        try {
            const role = await _1.models.Role.findOne({
                where: {
                    id: roleId
                }
            });
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].length > 10) {
                    const splitLine = lines[i].split(",");
                    const email = splitLine[0];
                    const name = splitLine[1];
                    const user = await _1.models.User.create({
                        name,
                        email,
                        language,
                        encrypedPassword: "12345"
                    });
                    await user.addRole(role);
                    console.error("pr " + projectId);
                    const project = await _1.models.Project.findOne({
                        where: {
                            id: projectId
                        }
                    });
                    if (!project) {
                        res.sendStatus(404);
                        break;
                    }
                    else {
                        user.addProject(project);
                    }
                }
            }
            res.sendStatus(200);
        }
        catch (error) {
            console.error(error);
            res.sendStatus(500);
        }
    }
}
exports.Project = Project;
const InitProject = (sequelize) => {
    Project.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: new sequelize_1.DataTypes.STRING(256),
            allowNull: false,
        },
        description: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        language: {
            type: new sequelize_1.DataTypes.STRING(10),
            allowNull: true,
        },
        userId: {
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
    }, {
        timestamps: true,
        paranoid: true,
        tableName: "projects",
        sequelize,
    });
    return Project;
};
exports.InitProject = InitProject;
