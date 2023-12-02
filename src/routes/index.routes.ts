import { Application } from "express";
import { usersRouter } from "./users.routes";
import { socialRouter } from "./social.routes";
import { postsRouter } from "./posts.routes";
import { commentsRouter } from "./comments.routes";


export default function registerRoutes(app: Application) {
    app.use('/api/users', usersRouter);
    app.use('/api/posts', postsRouter);
    app.use('/api/comments', commentsRouter);
    app.use('/api/social', socialRouter);
}