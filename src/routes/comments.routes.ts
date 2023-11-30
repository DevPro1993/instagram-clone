import express, { Router } from "express";
import container from "../inversify/container.inversify";
import DITokens from "../inversify/di-tokens.inversify";



const router: Router = express.Router();

// const commentsRouter = container.get<ICommentController>(DITokens.ICommentController)

// router.get('/', postController.getAll)
// router.get('/feed', postController.getAllPostsForFeed)
// router.post('/like/:id', postController.likePost)
// router.post('/unlike/:id', postController.unlikePost)
// router.get('/:id', postController.getById)
// router.post('/', validatePayload(CreatePostDtoSchema), postController.save)
// router.put('/:id', validatePayload(EditPostDtoSchema), postController.update)
// router.delete('/', postController.bulkDelete)
// router.delete('/:id', postController.delete)


export const commentsRouter = router;