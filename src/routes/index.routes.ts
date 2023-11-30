import { Application } from "express";
import { usersRouter } from "./users.routes";
import { dashboardRouter } from "./dashboard.routes";
import { postsRouter } from "./posts.routes";
import { commentsRouter } from "./comments.routes";


export default function registerRoutes(app: Application) {
    app.use('/api/users', usersRouter);
    app.use('/api/posts', postsRouter);
    app.use('/api/comments', commentsRouter);
    app.use('/api/dashboard', dashboardRouter);
}