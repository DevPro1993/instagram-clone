import express, { Router } from "express";
import { CreateCommentDtoSchema, EditCommentDtoSchema } from "../models/dtos/comment/create-or-edit-comment.dto";
import validatePayload from "../middlewares/payload-validation.middleware";
import { CommentController } from "../controllers/comment/comment.controller";


const router: Router = express.Router();


router.get('/:postId', CommentController.getAllCommentsForPost)
router.post('/like/:id', CommentController.likeComment)
router.post('/unlike/:id', CommentController.unlikeComment)
router.post('/:postId', validatePayload(CreateCommentDtoSchema), CommentController.save)
router.put('/:id', validatePayload(EditCommentDtoSchema), CommentController.update)
router.delete('/:id', CommentController.delete)


export const commentsRouter = router;