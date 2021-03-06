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

import { User } from "./user";

// Some attributes are optional in `User.build` and `User.create` calls
interface RoleCreationAttributes extends Optional<RoleAttributes, "id"> {}

export class Role
  extends Model<RoleAttributes, RoleCreationAttributes>
  implements RoleAttributes {
  public id!: number;
  public nameToken!: string;

  // timestamps!
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
}

export const InitRole = (sequelize: Sequelize) => {
  Role.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nameToken: {
        type: new DataTypes.STRING(256),
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      tableName: "roles",
      sequelize,
    }
  );

  return Role;
};
