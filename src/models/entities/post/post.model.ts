import { Model, InferAttributes, InferCreationAttributes, DataTypes, CreationOptional, NonAttribute, HasManyAddAssociationsMixin, HasManyRemoveAssociationsMixin } from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Table, HasMany } from '@sequelize/core/decorators-legacy';
import { User } from '../user/user.model';
import { Comment } from '../comment/comment.model';
import { PostImage } from '../post-image/post-image.model';


@Table({
    tableName: 'posts',
    underscored: true,
})
export class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {

    declare createdAt: CreationOptional<Date>;

    declare updatedAt: CreationOptional<Date>;

    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    declare id: CreationOptional<number>;

    @Attribute(DataTypes.TEXT)
    @NotNull
    declare text: string;


    // This is the foreign key

    declare likedByUsers?: NonAttribute<User[]>;

    declare bookmarkedByUsers?: NonAttribute<User[]>;

    declare user: NonAttribute<User>;

    @Attribute(DataTypes.INTEGER)
    @NotNull
    declare userId: number;

    @HasMany(() => Comment, {
        foreignKey: {
            name: 'postId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        inverse: {
            as: 'post',
        },
    })
    declare comments?: NonAttribute<Comment[]>;

    @HasMany(() => PostImage, {
        foreignKey: {
            name: 'postId',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        inverse: {
            as: 'post',
        },
    })
    declare postImages?: NonAttribute<PostImage[]>;

}