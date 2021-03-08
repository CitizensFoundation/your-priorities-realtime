import {
  Sequelize,
  Model,
  ModelDefined,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  Association,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Optional,
} from "sequelize";

import { Role } from './role';
import { Project } from './project';

const sequelize = new Sequelize("mysql://root:asd123@localhost:3306/mydb");

// Some attributes are optional in `User.build` and `User.create` calls
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public language!: string;
  public encrypedPassword!: string | null;
  public ypUserId!: number | null;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public getRole!: HasManyGetAssociationsMixin<Role>; // Note the null assertions!
  public addRole!: HasManyAddAssociationMixin<Role, number>;
  public hasRole!: HasManyHasAssociationMixin<Role, number>;

  public getProject!: HasManyGetAssociationsMixin<Project>; // Note the null assertions!
  public addProject!: HasManyAddAssociationMixin<Project, number>;

  public readonly roles?: Role[];

  public readonly projects?: Project[];

  public static associations: {
    roles: Association<User, Role>,
    projects: Association<User, Project>;
  };
}

export const InitUser = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: new DataTypes.STRING(256),
        allowNull: false,
      },
      email: {
        type: new DataTypes.STRING(256),
        allowNull: false,
      },
      language: {
        type: new DataTypes.STRING(10),
        allowNull: false,
      },
      encrypedPassword: {
        type: new DataTypes.STRING(2048),
        allowNull: false,
      },
      ypUserId: {
        type: new DataTypes.NUMBER,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      }
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "users",
      sequelize
    }
  );

  User.hasMany(Project, {
    sourceKey: "id",
    foreignKey: "userId",
    as: "projects"
  });


  User.hasMany(Role, {
    sourceKey: "id",
    foreignKey: "userId",
    as: "roles"
  });
}

