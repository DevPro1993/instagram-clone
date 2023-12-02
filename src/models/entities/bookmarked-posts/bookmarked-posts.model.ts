
import { Model, InferAttributes, InferCreationAttributes, DataTypes } from '@sequelize/core';
import { Attribute, PrimaryKey, Table } from '@sequelize/core/decorators-legacy';

@Table({
    tableName: "bookmarked_posts",
    underscored: true
})
export default class BookmarkedPosts extends Model<InferAttributes<BookmarkedPosts>, InferCreationAttributes<BookmarkedPosts>> {


    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    declare userId: number;

    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    declare postId: number;
}