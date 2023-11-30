
import { Model, InferAttributes, InferCreationAttributes, DataTypes } from '@sequelize/core';
import { Attribute, PrimaryKey, Table } from '@sequelize/core/decorators-legacy';

@Table({
    tableName: "liked_posts",
    underscored: true
})
export default class LikedPosts extends Model<InferAttributes<LikedPosts>, InferCreationAttributes<LikedPosts>> {


    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    declare userId: number;

    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    declare postId: number;
}