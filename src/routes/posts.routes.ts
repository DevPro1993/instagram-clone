import express, { Router } from "express";
import validatePayload from "../middlewares/payload-validation.middleware";
import { PostController } from "../controllers/post/post.controller";
import { CreatePostDtoSchema, EditPostDtoSchema } from "../models/dtos/post/create-or-edit-post.dto";


const router: Router = express.Router();


router.get('/', PostController.getAll)
router.get('/feed', PostController.getAllPostsForFeed)
router.post('/like/:id', PostController.likePost)
router.post('/unlike/:id', PostController.unlikePost)
router.get('/:id', PostController.getById)
router.post('/', validatePayload(CreatePostDtoSchema), PostController.save)
router.put('/:id', validatePayload(EditPostDtoSchema), PostController.update)
router.delete('/', PostController.bulkDelete)
router.delete('/:id', PostController.delete)


export const postsRouter = router;