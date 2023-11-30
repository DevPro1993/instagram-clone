import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute, BelongsToManyAddAssociationsMixin, BelongsToManyRemoveAssociationsMixin } from '@sequelize/core';
import { Attribute, PrimaryKey, AutoIncrement, NotNull, Unique, Table, HasMany, BelongsToMany } from '@sequelize/core/decorators-legacy';
import { Post } from '../post/post.model';
import { Comment } from '../comment/comment.model';
import Gender from '../../shared/enums/gender.enum';

@Table({
  tableName: 'users',
  underscored: true
})
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {

  // Props

  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare firstName: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare lastName: string;

  @Attribute(DataTypes.STRING)
  @Unique
  @NotNull
  declare email: string;

  @Attribute(DataTypes.STRING)
  @NotNull
  declare password: string;

  @Attribute(DataTypes.ENUM([Gender.Female, Gender.Male]))
  @NotNull
  declare gender: Gender;

  // Relations

  // Posts

  @HasMany(() => Post, {
    foreignKey: {
      name: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    inverse: {
      as: 'user',
    },
  })
  declare posts?: NonAttribute<Post[]>;

  // Comments

  @HasMany(() => Comment, {
    foreignKey: {
      name: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    inverse: {
      as: 'user',
    },
  })
  declare comments?: NonAttribute<Comment[]>;

  // LikedPosts

  @BelongsToMany(() => Post, {
    foreignKey: {
      name: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    otherKey: {
      name: 'postId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    through: 'LikedPosts',
    inverse: {
      as: 'likedByUsers',
    },
  })
  declare likedPosts?: NonAttribute<Post[]>;

  declare addLikedPosts: BelongsToManyAddAssociationsMixin<Post,Post['id']>;

  declare removeLikedPosts: BelongsToManyRemoveAssociationsMixin<Post, Post['id']>;

  // LikedComments

  @BelongsToMany(() => Comment, {
    foreignKey: {
      name: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    otherKey: {
      name: 'commentId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    through: 'LikedComments',
    inverse: {
      as: 'likedByUsers',
    }
  })
  declare likedComments?: NonAttribute<Comment[]>;

  declare addLikedComments: BelongsToManyAddAssociationsMixin<Comment,Comment['id']>;

  declare removeLikedComments: BelongsToManyRemoveAssociationsMixin<Comment, Comment['id']>;

  // Following

  @BelongsToMany(() => User, {
    foreignKey: {
      name: 'userId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    otherKey: {
      name: 'followingUserId',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    through: 'UserFollowing',
    inverse: {
      as: 'followers',
    },
  })
  declare following?: NonAttribute<User[]>;

  declare followers?: NonAttribute<User[]>;

}