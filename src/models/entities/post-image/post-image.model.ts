import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional, NonAttribute } from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Table } from '@sequelize/core/decorators-legacy';
import { Post } from '../post/post.model';


@Table({
    tableName: 'post_images',
    underscored: true
})
export class PostImage extends Model<InferAttributes<PostImage>, InferCreationAttributes<PostImage>> {

    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare fileId: string;

    @Attribute(DataTypes.TEXT)
    @NotNull
    declare url: string;

    // This is the foreign key


    declare post: NonAttribute<Post>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare postId: number;




}