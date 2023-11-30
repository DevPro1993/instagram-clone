import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional, NonAttribute } from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Table } from '@sequelize/core/decorators-legacy';
import { Post } from '../post/post.model';
import { User } from '../user/user.model';


@Table({
    tableName: 'comments',
    underscored: true
})
export class Comment extends Model<InferAttributes<Comment>, InferCreationAttributes<Comment>> {

    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.TEXT)
    @NotNull
    declare text: string;

    // This is the foreign key

    declare likedByUsers?: NonAttribute<User[]>;

    declare post: NonAttribute<Post>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare postId: number;

    declare user: NonAttribute<User>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare userId: number;


}