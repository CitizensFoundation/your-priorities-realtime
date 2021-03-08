import { InitUser } from './user';
import { InitProject } from './project';
import { InitRole } from './role';
import { InitRound } from './round';

const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.json`)[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

export const models = {
  sequelize,
  Sequelize,
  Role: InitRole(sequelize),
  Project: InitProject(sequelize),
  User: InitUser(sequelize),
  Round: InitRound(sequelize)
};

(async () => {
  await sequelize.sync();
});

