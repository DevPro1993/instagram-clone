import { NextFunction, Request, Response } from "express";
import JwtPayload from "../models/entities/user/jwt-payload.model";
import AuthenticationUtils from "../utils/auth/authentication.utils";
import { User } from "../models/entities/user/user.model";
import HTTPMethods from "../models/shared/enums/http-methods.enum";
import AsyncLocalStorageUtils from "../utils/async-local-storage/async-local-storage.utils";

const allowedRoutes = [
    { method: HTTPMethods.POST, url: '/api/users' },
    { method: HTTPMethods.POST, url: '/api/users/login' },
    { method: HTTPMethods.GET, url: '/api-docs/' },
]


const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { url, method } = req;
    if (allowedRoutes.find(r => r.method === method && r.url === url)) {
        AsyncLocalStorageUtils.set('sessionInfo', null, next)
    } else {
        const token = req.headers?.authorization?.split(' ')?.[1];
        if (!token) return res.status(403).send({ message: 'Access token is missing' });
        try {
            const decodedToken: JwtPayload = await AuthenticationUtils.validateAccessToken(token);
            // TODO: also check if user is in db
            const user = await User.findByPk(decodedToken.id);
            if (!user) return res.status(403).send({ message: 'User does not exist' });
            AsyncLocalStorageUtils.set('sessionInfo', decodedToken, next)
        } catch (error) {
            return res.status(403).send({ message: 'Invalid Access Token' });
        }
    }
}

export default authenticationMiddleware;