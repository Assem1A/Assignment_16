import jwt, { JwtPayload, SignOptions } from "jsonwebtoken"
import { randomUUID } from "node:crypto";;
import { forbiddenException } from "../exceptions";

export const tokenSign =  (payload: object, secret: string, expiresIn: string): string => {
    const jwtid = randomUUID();
    
    const optional: SignOptions = {
        expiresIn: expiresIn as NonNullable<SignOptions["expiresIn"]>,
        jwtid,
    };
    const token =  jwt.sign(payload, secret, optional)
    return token
}
export const tokenVerify = (authentication: string, secret: string): jwt.JwtPayload => {
    let decoded: JwtPayload
    try {
        decoded = jwt.verify(authentication, secret as string) as JwtPayload;


    }
    catch (error) {
        throw new forbiddenException("Invalid  tokenss type");
    }
    return decoded
}