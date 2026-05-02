import { NextFunction, Request, Response } from "express"
import { BadRequestException } from "../common";
import { ZodError, ZodType } from "zod";
type keyRequest=keyof Request
type schemaType=Partial<Record<keyRequest,ZodType> >
export const validation=(schema:schemaType)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        const issues:Array<{
        key:keyRequest,
        issues:Array<{
            message:string,
            path:(symbol|number|string|undefined|null)[]
        }>
    }>=[];
        for(const key of Object.keys(schema) as keyRequest[]){
            console.log(key);
            if(!schema[key]
            )continue
        const result=    schema[key].safeParse(req[key]);
        
        
        if(!result.success){
            console.log("gender");
            const error=result.error as ZodError
            issues.push({key ,issues:error.issues.map(issue=>{
                return{
                    path:issue.path,
                    message:issue.message
                }
            })})
        }
        }
        
        if (issues.length){
        throw  new BadRequestException("validation error",{cause:issues })
        }
        next()
    }
}