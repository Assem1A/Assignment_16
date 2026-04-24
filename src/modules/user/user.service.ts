import { compare,hash } from "bcrypt";
import { BadRequestException, notFoundException } from "../../common";
import { delete1, keys, set, userModel } from "../../DB";
import { Ilogout, IupdatePassword } from "./user.dto";
import { userInfo } from "node:os";
import { revokeTokenKey } from "../../middleware/auth.middleware";


export class userService{
    constructor(){}
    public updatePassword=async(data:IupdatePassword)=>{
        const {id,oldPassword,password}=data
        const user=await userModel.findById(id)
        if(!user)throw new notFoundException("user not found")
        const wrongPassword=!await compare(oldPassword,user.password)
        if(wrongPassword)throw new notFoundException("wrong password")
        const samePassword=await compare(password, user.password)
              if (samePassword) {
    throw new BadRequestException("user password must not be the same with old password")
  }

        user.password=await hash(password,8)
        user.save()

    }
    public logout=async(data:Ilogout)=>{
        const {id,decoded,flag}=data
        console.log( flag);
        
        const user= await userModel.findById(id)
        if (!user) throw new notFoundException("user not found")
        switch (flag) {
    case 1:
      user.CCT = new Date
          console.log("omars");
          
      await user.save();
      console.log(await keys(`revokecToken::2${id}`));

      await delete1(await keys(`revokecToken::2${id}`))
      break;
    default:

      await set({
        key: revokeTokenKey((id as string), (decoded?.jti as string)),
        val: (decoded?.jti as string),
        ttl: ((decoded?.iat as number) + 7 * 24 * 60 * 60)
      })
  
  }
    }
}
export default new userService()