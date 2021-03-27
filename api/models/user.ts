import {
  Sequelize,
  Model,
  ModelDefined,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyHasAssociationMixin,
  Association,
  BelongsToManyAddAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  Optional,
  BelongsToManyGetAssociationsMixin,
} from "sequelize";

import { Role } from './role';
import { Project } from './project';

// Some attributes are optional in `User.build` and `User.create` calls
interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public language?: string | null;
  public selectedAvatar?: string | null;
  public selectedAvatarColor?: string | null;
  public encrypedPassword!: string | null;
  public ypUserId?: number;

  // timestamps!
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  // Since TS cannot determine model association at compile time
  // we have to declare them here purely virtually
  // these will not exist until `Model.init` was called.
  public addRole!: BelongsToManyAddAssociationMixin<Role, number>;
  public hasRole!: BelongsToManyAddAssociationMixin<Role, number>;

  public getProject!: BelongsToManyGetAssociationsMixin<Project>; // Note the null assertions!
  public addProject!: BelongsToManyAddAssociationMixin<Project, number>;

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
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: new DataTypes.STRING(256),
        allowNull: false,
      },
      email: {
        type: new DataTypes.STRING(256),
        allowNull: true,
        unique: true
      },
      language: {
        type: new DataTypes.STRING(10),
        allowNull: false,
      },
      selectedAvatar: {
        type: new DataTypes.STRING(256),
        allowNull: true,
      },
      selectedAvatarColor: {
        type: new DataTypes.STRING(64),
        allowNull: true,
      },
      encrypedPassword: {
        type: new DataTypes.STRING(2048),
        allowNull: true,
      },
      ypUserId: {
        type: new DataTypes.INTEGER,
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

  return User;
}

