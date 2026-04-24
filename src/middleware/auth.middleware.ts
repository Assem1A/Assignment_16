import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import {JwtPayload} from "jsonwebtoken"

import { get1, userModel } from "../DB";
import { forbiddenException, notFoundException } from "../common";
export const revokeTokenKey = (userID:string, jti:string) => {
  console.log(userID, jti);

  return `revokecToken::2${userID}::${jti}`
}
export interface myreq extends Request{
       user?:  {
  id: string;
  email: string;
  role: number;
};
      decoded?: {
        jti: string|undefined;
        iat: number|undefined;
        exp: number|undefined;
      };
}
export const auth = async (req: myreq, res: Response, next: NextFunction) => {
    const authentication = req.headers.authorization as string
    let decoded
    try {
        decoded = jwt.verify(authentication, "JWT_SECRET") as JwtPayload ;

        if (decoded.jti && await get1(revokeTokenKey(decoded.id, decoded.jti))) {
          throw new forbiddenException( "Invalid  tokenss type");

        }
    }
    catch (error) {
   throw new forbiddenException( "Invalid  tokenss type");
    }
        const user = await userModel.findById(decoded.id)
    if (!user) throw new notFoundException("user not found")
    req.user = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,}
    req.decoded=
    {
      jti:decoded.jti,
      iat:decoded.iat,
      exp:decoded.exp

    }
    if(user.CCT&&user.CCT.getTime()>=( decoded.iat as number) * 1000){
     throw new forbiddenException( "Invalid  tokenss type");

    }
    next()
}
export const authorization = (role:number ) => {


    return async (req:myreq, res:Response, next:NextFunction) => {

        if ((req.user as {
            id:string,
            email:string
            role:number}).role <role) {
            throw new forbiddenException("you are not allowed to do this")
    }
            next()

  }
}