import { Request, Response } from "express";
import { CommentDto } from "../../models/dtos/comment/comment.dto";
import AsyncLocalStorageUtils from "../../utils/async-local-storage/async-local-storage.utils";
import { Comment } from "../../models/entities/comment/comment.model";
import { CreateCommentDto, EditCommentDto } from "../../models/dtos/comment/create-or-edit-comment.dto";
import { User } from "../../models/entities/user/user.model";



export class CommentController {

    static toDto(comment: Comment): CommentDto {
        const currentUserId = AsyncLocalStorageUtils.getLoggedInUserId();
        return {
            id: comment.id,
            text: comment.text,
            likedByMe: !!comment.likedByUsers?.map(r => r.id).includes(currentUserId)
        }
    }


    static getAllCommentsForPost = async (req: Request, res: Response) => {
        try {
            const postId = parseInt(req.params.postId);
            const comments = await Comment.findAll({ where: { postId } });
            return res.send(comments);
        } catch (error: any) {
            res.status(500).send({ message: error.message })
        }
    }

    static save = async (req: Request, res: Response) => {
        try {
            const postId = parseInt(req.params.postId);
            const userId = AsyncLocalStorageUtils.getLoggedInUserId();
            const createCommentDto = req.body as CreateCommentDto;
            const comment = Comment.build({ ...createCommentDto, postId, userId });
            const newComment: Comment = await comment.save();
            return res.status(201).send(newComment.id);
        } catch (error: any) {
            res.status(500).send({ message: error.message })
        }
    }


    static update = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            const comment = await Comment.findByPk(id);
            if (comment) {
                comment.set(req.body as EditCommentDto);
                await comment.save();
                return res.sendStatus(204);
            }
            throw new Error("Comment not found")
        } catch (error: any) {
            res.status(500).send({ message: error.message })
        }
    }

    static likeComment = async (req: Request, res: Response) => {
        try {
            const commentId = req.params.id;
            if (!commentId) throw new Error("Comment id missing")
            const currentUserId = AsyncLocalStorageUtils.getLoggedInUserId();
            const user = await User.findByPk(currentUserId, {
                include: [{ association: 'likedComments' }]
            }) as User;
            await user.addLikedComments([parseInt(commentId)]);
            return res.sendStatus(201)
        } catch (error: any) {
            res.status(500).send({ message: error.message })
        }
    }

    static unlikeComment = async (req: Request, res: Response) => {
        try {
            const commentId = req.params.id;
            if (!commentId) throw new Error("Comment id missing")
            const currentUserId = AsyncLocalStorageUtils.getLoggedInUserId();
            const user = await User.findByPk(currentUserId, {
                include: [{ association: 'likedComments' }]
            }) as User;
            await user.removeLikedComments([parseInt(commentId)]);
            return res.sendStatus(201)
        } catch (error: any) {
            res.status(500).send({ message: error.message })
        }
    }


    static delete = async (req: Request, res: Response) => {
        try {
            const id = parseInt(req.params.id);
            await Comment.destroy({
                where: { id }
            })
            return res.sendStatus(204);
        } catch (error: any) {
            res.status(500).send({ message: error.message })
        }
    }


}