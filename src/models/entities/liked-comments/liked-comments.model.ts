
import { Model, InferAttributes, InferCreationAttributes, DataTypes } from '@sequelize/core';
import { Attribute, PrimaryKey, Table } from '@sequelize/core/decorators-legacy';

@Table({
    tableName: "liked_comments",
    underscored: true
})
export default class LikedComments extends Model<InferAttributes<LikedComments>, InferCreationAttributes<LikedComments>> {

    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    declare userId: number;

    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    declare commentId: number;
}