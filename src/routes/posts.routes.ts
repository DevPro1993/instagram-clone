import express, { Router } from "express";
import validatePayload from "../middlewares/payload-validation.middleware";
import { PostController } from "../controllers/post.controller";
import { CreatePostDtoSchema, EditPostDtoSchema } from "../models/dtos/post/create-or-edit-post.dto";


const router: Router = express.Router();

router.get('/imagekit-signature', PostController.getImageKitSignature)
router.get('/feed', PostController.getAllPostsForFeed)
router.get('/:id', PostController.getById)
router.get('/', PostController.getAll)


router.post('/like/:id', PostController.likePost)
router.post('/unlike/:id', PostController.unlikePost)
router.post('/bookmark/:id', PostController.bookmarkPost)
router.post('/unbookmark/:id', PostController.unbookmarkPost)
router.post('/', validatePayload(CreatePostDtoSchema), PostController.save)

router.put('/:id', validatePayload(EditPostDtoSchema), PostController.update)

router.delete('/image/:imageId', PostController.removeImagesFromPost)
router.delete('/:id', PostController.delete)
router.delete('/', PostController.bulkDelete)





export const postsRouter = router;