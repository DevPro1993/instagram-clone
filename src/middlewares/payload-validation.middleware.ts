import { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject, z } from 'zod';


const validatePayload = (payloadSchema: ZodObject<any>, validateFromQuery?: boolean) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const validationResult: any = payloadSchema.safeParse(validateFromQuery ? req.query : req.body);
        const error = validationResult["error"] as ZodError;
        if (error) {
            res.status(400).send(error);
        } else {
            next();
        }
    }
}

export default validatePayload;