import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { JwtPayload } from "jsonwebtoken"

import { get1, userModel } from "../DB";
import { forbiddenException, notFoundException } from "../common";
import { JWT_SECRET } from "../.env/cofig.env";
import { DBrepo } from "../DB/model/repo";
import { IUser } from "../common/interfaces";
import { tokenVerify } from "../common/utils/token";
export const tokenNameInRedis = (message: string, userID: string, jti?: string) => {
  if (jti) {
    return `${message}${userID}${jti}`

  }
  return `${message}${userID}`
}
export interface myreq extends Request {
  user?: {
    id: string;
    email: String;
    role: number;
  };
  decoded?: {
    jti: string | undefined;
    iat: number | undefined;
    exp: number | undefined;
  };
}
export const auth = async (req: myreq, res: Response, next: NextFunction) => {
  const authentication = req.headers.authorization as string
  const userRepo: DBrepo<IUser> = new DBrepo(userModel)
  const decoded = tokenVerify(authentication, JWT_SECRET as string)
  if (decoded.jti && await get1(tokenNameInRedis("rt2", decoded.id, decoded.jti))) {
    throw new forbiddenException("Invalid  tokenss type");

  }
  const user = await userRepo.findOneM({ data: { _id: decoded.id }, projection: {} })
  if (!user) throw new notFoundException("user not found")
  req.user = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  }
  req.decoded =
  {
    jti: decoded.jti,
    iat: decoded.iat,
    exp: decoded.exp

  }
  if (user.CCT && user.CCT.getTime() >= (decoded.iat as number) * 1000) {
    throw new forbiddenException("Invalid  tokenss type");

  }
  next()
}
export const authorization = (role: number) => {


  return async (req: myreq, res: Response, next: NextFunction) => {

    if ((req.user as {
      id: string,
      email: string
      role: number
    }).role < role) {
      throw new forbiddenException("you are not allowed to do this")
    }
    next()

  }
}