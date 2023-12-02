import { Request, Response } from "express";
import { Post } from "../models/entities/post/post.model";
import { User } from "../models/entities/user/user.model";
import AsyncLocalStorageUtils from "../utils/async-local-storage/async-local-storage.utils";
import { PostDto } from "../models/dtos/post/post.dto";
import { CreatePostDto, EditPostDto } from "../models/dtos/post/create-or-edit-post.dto";
import { Op } from "@sequelize/core";


export class PostController {

    static toDto(post: Post): PostDto {
        const currentUserId = AsyncLocalStorageUtils.getLoggedInUserId();
        return {
            id: post.id,
            text: post.text,
            likedByMe: !!post.likedByUsers?.map(r => r.id).includes(currentUserId)
        }
    }


    static getAllPostsForFeed = async (req: Request, res: Response) => {
        try {
            // find all people current user is following
            const userId = AsyncLocalStorageUtils.getLoggedInUserId();
            const user = await User.findByPk(userId, {
                include: [
                    {
                        association: 'following',
                        required: true,
                        include: [
                            {
                                association: 'posts',
                                include: [
                                    {
                                        association: 'likedByUsers'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });
            if (!user) throw new Error("No following found for the user");
            const usersFollowing = user.following as User[];
            // get posts of all these users and sort them by creation date
            const posts: Post[] = usersFollowing.map(u => u.posts as Post[]).reduce((a, v) => ([...a, ...v]), []);
            // return post dtos
            return res.send(posts.map(p => PostController.toDto(p)))
        } catch (error: any) {
            res.status(500).send({ message: error.message })
        }
    }

    static save = async (req: Request, res: Response) => {
        try {
            const userId = AsyncLocalStorageUtils.getLoggedInUserId();
            const createPostDto = req.body as CreatePostDto;
            const post = Post.build({ ...createPostDto, userId });
            const newPost: Post = await post.save();;
            return res.status(201).send({ id: newPost.id });
        } catch (error: any) {
            res.status(500).send({ message: error.message })
        }
    }


    static update = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params["id"]);
            const post = await Post.findByPk(id);
            if (post) {
                post.set(req.body as EditPostDto);
                await post.save();
                return res.sendStatus(204);
            }
            throw new Error("Post not found")
        } catch (error: any) {
            res.status(500).send({ message: error.message })
        }
    }

    static likePost = async (req: Request, res: Response) => {
        try {
            const postId = req.params.id;
            if (!postId) throw new Error("Post id missing")
            const currentUserId = AsyncLocalStorageUtils.getLoggedInUserId();
            const user = await User.findByPk(currentUserId, {
                include: [{ association: 'likedPosts' }]
            }) as User;
            await user.addLikedPosts([parseInt(postId)]);
            return res.sendStatus(201)
        } catch (error: any) {
            res.status(500).send({ message: error.message })
        }
    }

    static unlikePost = async (req: Request, res: Response) => {
        try {
            const postId = req.params.id;
            if (!postId) throw new Error("Post id missing")
            const currentUserId = AsyncLocalStorageUtils.getLoggedInUserId();
            const user = await User.findByPk(currentUserId, {
                include: [{ association: 'likedPosts' }]
            }) as User;
            await user.removeLikedPosts([parseInt(postId)]);
            return res.sendStatus(201)
        } catch (error: any) {
            res.status(500).send({ message: error.message })
        }
    }


    static getAll = async (req: Request, res: Response) => {
        try {
            const userId = AsyncLocalStorageUtils.getLoggedInUserId();
            const posts: Post[] = await Post.findAll({ where: { userId } });
            return res.send(posts);
        } catch (error: any) {
            res.status(500).send({ message: error.message })
        }
    }

    static getById = async (req: Request, res: Response) => {
        try {
            const posts: Post[] = await Post.findAll({ where: { id: parseInt(req.params.id) } });
            return res.send(posts);
        } catch (error: any) {
            res.status(500).send({ message: error.message })
        }
    }

    static delete = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            await Post.destroy({
                where: { id }
            })
            return res.sendStatus(204);
        } catch (error: any) {
            res.status(500).send({ message: error.message })
        }
    }

    static bulkDelete = async (req: Request, res: Response) => {
        try {
            const ids: number[] = req.body["ids"];
            await Post.destroy({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                }
            })
            return res.sendStatus(204);
        } catch (error: any) {
            res.status(500).send({ message: error.message })
        }
    }

}