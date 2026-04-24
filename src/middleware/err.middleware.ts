import type { Request, NextFunction, Response } from "express";
interface IError extends Error{
statusCode:number
}
export const globalErrorHandler = (err: IError, req: Request, res: Response, next: NextFunction) => {

    const st=err.statusCode||500
    return res.status(st).json({ msg: err.message || "internal server error", err, cause: err.cause, stack: err.stack })
}