import { Response, Router, NextFunction } from "express";
import { auth, authorization, myreq } from "../../middleware/auth.middleware";
import { Igetprofilegeneric } from "./user.entity";
import { successResponse } from "../../common/response";
import { logoutSchema, updatePasswordSchema } from "./user.validation";
import  userService  from "./user.service";
import { validation } from "../../middleware";

const router=Router()
router.get("/get-my-profile",auth,authorization(0),async(req:myreq,res:Response,next:NextFunction):Promise<Response>=>{
     
      const user = await userService.getProfile(req.user?.id as string)
      
  
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
router.patch("/update-password",validation(updatePasswordSchema),auth,async(req:myreq,res:Response,next:NextFunction):Promise<Response> =>{

    userService.updatePassword({id:req.user?.id,oldPassword:req.body.oldPassword,password:req.body.password})
    return successResponse({

      res,
      message: "password updated successfully",
      status: 200
    })
})
router.post("/logout",validation(logoutSchema),auth,async(req:myreq,res:Response,next:NextFunction):Promise<Response> =>{

    console.log(req.body.flag);
    
    userService.logout({id:req.user?.id,decoded:req.decoded,flag:req.body.flag})

    return successResponse({

      res,
      message: "logout done successfully",
      status: 200
    })
})
export default router