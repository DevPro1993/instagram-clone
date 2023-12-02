import express, { Router } from "express";
import validatePayload from "../middlewares/payload-validation.middleware";
import { CreateUserDtoSchema } from "../models/dtos/users/create-user.dto";
import { UserController } from "../controllers/user.controller";
import { LoginUserDtoSchema } from "../models/dtos/users/login-user.dto";

const router: Router = express.Router();

router.post('/', validatePayload(CreateUserDtoSchema), UserController.save)
router.post('/login', validatePayload(LoginUserDtoSchema), UserController.login)

export const usersRouter = router;