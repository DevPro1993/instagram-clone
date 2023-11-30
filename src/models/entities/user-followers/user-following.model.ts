
import { Model, InferAttributes, InferCreationAttributes, DataTypes } from '@sequelize/core';
import { Attribute, PrimaryKey, Table } from '@sequelize/core/decorators-legacy';

@Table({
    tableName: "user_following",
    underscored: true
})
export default class UserFollowing extends Model<InferAttributes<UserFollowing>, InferCreationAttributes<UserFollowing>> {


    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    declare userId: number;

    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    declare followingUserId: number;
}