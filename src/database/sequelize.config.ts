import Sequelize, { Dialect } from "@sequelize/core";
import { User } from "../models/entities/user/user.model";
import dotenv from 'dotenv';
import { Post } from "../models/entities/post/post.model";
import { Comment } from "../models/entities/comment/comment.model";
import LikedPosts from "../models/entities/liked-posts/liked-posts.model";
import LikedComments from "../models/entities/liked-comments/liked-comments.model";
import UserFollowing from "../models/entities/user-followers/user-following.model";
dotenv.config();

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PROVIDER } = process.env;

const db = new Sequelize(
    DB_NAME as string,
    DB_USER as string,
    DB_PASSWORD as string,
    {
        host: DB_HOST as string,
        dialect: DB_PROVIDER as Dialect,
        models: [User, Post, Comment, LikedPosts, LikedComments, UserFollowing],
        logging: false
    },
);

export default db;