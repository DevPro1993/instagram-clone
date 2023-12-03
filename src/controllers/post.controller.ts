import { Request, Response } from "express";
import { Post } from "../models/entities/post/post.model";
import { User } from "../models/entities/user/user.model";
import AsyncLocalStorageUtils from "../utils/async-local-storage/async-local-storage.utils";
import { PostDto } from "../models/dtos/post/post.dto";
import { CreatePostDto, EditPostDto } from "../models/dtos/post/create-or-edit-post.dto";
import { Op } from "@sequelize/core";
import imagekit from "../imagekit/imagekit";
import { PostImage } from "../models/entities/post-image/post-image.model";


export class PostController {

    static toDto(post: Post, bookmarked?: boolean): PostDto {
        const currentUserId = AsyncLocalStorageUtils.getLoggedInUserId();
        return {
            id: post.id,
            text: post.text,
            likedByMe: !!post.likedByUsers?.map(r => r.id).includes(currentUserId),
            bookmarkedByMe: bookmarked || !!post.bookmarkedByUsers?.map(r => r.id).includes(currentUserId),
            createdAt: post.createdAt,
            imageUrls: post.postImages?.map(({ fileId, url, id }) => ({ fileId, url, id })),
            likes: post.likedByUsers?.length || 0,
            comments: post.comments?.length || 0
        }
    }

    static getAllBookarmedPosts = async (req: Request, res: Response) => {
        try {
            // find all people current user is following
            const userId = AsyncLocalStorageUtils.getLoggedInUserId();
            const user = await User.findByPk(userId, {
                include: [
                    {
                        association: 'bookmarkedPosts',
                        where: { text: { [Op.like]: `%${req.query.q || ''}%` } },
                        include: [
                            {
                                association: 'likedByUsers'
                            },
                            {
                                association: 'postImages'
                            },
                            {
                                association: 'comments'
                            }
                        ]
                    }
                ]
            }) as User;
            const posts = user.bookmarkedPosts || [];
            return res.send(posts.map(p => PostController.toDto(p, true)))
        } catch (error: any) {
            res.status(500).send({ message: error.message })
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
                                where: { text: { [Op.like]: `%${req.query.q || ''}%` } },
                                include: [
                                    {
                                        association: 'likedByUsers'
                                    },
                                    {
                                        association: 'bookmarkedByUsers'
                                    },
                                    {
                                        association: 'postImages'
                                    },
                                    {
                                        association: 'comments'
                                    }
                                ]
                            }
                        ]
                    }
                ],
                order: [
                    ['following', 'posts', 'createdAt', 'DESC'],
                ],
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
            const post = await Post.create({ text: createPostDto.text, userId });
            if (createPostDto.images?.length) {
                console.log(createPostDto.images)
                await PostImage.bulkCreate((createPostDto.images).map(({ url, fileId }) => ({ postId: post.id, url, fileId })))
            }
            return res.status(201).send({ postId: post.id });
        } catch (error: any) {
            res.status(500).send({ message: error.message })
        }
    }

    static removeImagesFromPost = async (req: Request, res: Response) => {
        try {
            const { fileId } = req.params;
            await imagekit.deleteFile(fileId)
            await PostImage.destroy({ where: { fileId } })
            return res.sendStatus(200);
        } catch (error: any) {
            res.status(500).send({ message: error.message })
        }
    }

    static getImageKitSignature = async (req: Request, res: Response) => res.send(imagekit.getAuthenticationParameters())


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

    static bookmarkPost = async (req: Request, res: Response) => {
        try {
            const postId = req.params.id;
            if (!postId) throw new Error("Post id missing")
            const currentUserId = AsyncLocalStorageUtils.getLoggedInUserId();
            const user = await User.findByPk(currentUserId, {
                include: [{ association: 'bookmarkedPosts' }]
            }) as User;
            await user.addBookmarkedPosts([parseInt(postId)]);
            return res.sendStatus(201)
        } catch (error: any) {
            res.status(500).send({ message: error.message })
        }
    }

    static unbookmarkPost = async (req: Request, res: Response) => {
        try {
            const postId = req.params.id;
            if (!postId) throw new Error("Post id missing")
            const currentUserId = AsyncLocalStorageUtils.getLoggedInUserId();
            const user = await User.findByPk(currentUserId, {
                include: [{ association: 'bookmarkedPosts' }]
            }) as User;
            await user.removeBookmarkedPosts([parseInt(postId)]);
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