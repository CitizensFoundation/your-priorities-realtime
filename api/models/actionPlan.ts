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

// Some attributes are optional in `User.build` and `User.create` calls
interface ActionPlanCreationAttributes extends Optional<ActionPlanAttributes, "id"> {}

export class ActionPlan
  extends Model<ActionPlanAttributes, ActionPlanCreationAttributes>
  implements ActionPlanAttributes {
  public id!: number;

  // timestamps!
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
}

export const InitActionPlan = (sequelize: Sequelize) => {
  ActionPlan.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      tableName: "action_plans",
      sequelize,
    }
  );

  return ActionPlan;
};
