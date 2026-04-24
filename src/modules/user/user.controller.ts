import { Response, Router, NextFunction } from "express";
import { auth, authorization, myreq } from "../../middleware/auth.middleware";
import { userModel } from "../../DB";
import { Igetprofilegeneric } from "./user.entity";
import { successResponse } from "../../common/response";
import { logoutSchema, updatePasswordSchema } from "./user.validation";
import { BadRequestException } from "../../common";
import  userService  from "./user.service";

const router=Router()
router.get("/get-my-profile",auth,authorization(0),async(req:myreq,res:Response,next:NextFunction):Promise<Response>=>{
    
      const user = await userModel.findById((req.user as {  id: string;
  email: string;
  role: number;}).id)

  
  return successResponse<Igetprofilegeneric>({
  
        res,
        message: "user selected successfully",
        status: 201,
        data:{
            id:(user?._id.toString() as string),
            email:user?.email,
            role:user?.role
        }
      })

})
router.patch("/update-password",auth,async(req:myreq,res:Response,next:NextFunction):Promise<Response> =>{
const result = await updatePasswordSchema.body.safeParseAsync(req.body);

    if (!result.success) {
      throw new BadRequestException("validation error", {
        cause: result.error.flatten(),
      });
    }
    userService.updatePassword({id:req.user?.id,oldPassword:req.body.oldPassword,password:req.body.password})
    return successResponse({

      res,
      message: "password updated successfully",
      status: 200
    })
})
router.post("/logout",auth,async(req:myreq,res:Response,next:NextFunction):Promise<Response> =>{
    const valids=await logoutSchema.body.safeParseAsync(req.body)
    if (!valids.success) {
      throw new BadRequestException("validation error", {
        cause: valids.error.flatten(),
      });
    }
    console.log(req.body.flag);
    
    userService.logout({id:req.user?.id,decoded:req.decoded,flag:req.body.flag})

    return successResponse({

      res,
      message: "logout done successfully",
      status: 200
    })
})
export default router