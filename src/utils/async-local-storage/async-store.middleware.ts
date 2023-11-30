import { NextFunction, Request, Response } from "express";
import AsyncLocalStorageUtils from "./async-local-storage.utils";


const asyncStoreMiddleware = (req: Request, res: Response, next: NextFunction) => AsyncLocalStorageUtils.init(next)

export default asyncStoreMiddleware;