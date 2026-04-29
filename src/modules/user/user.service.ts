import { compare,hash } from "bcrypt";
import { BadRequestException, notFoundException } from "../../common";
import { delete1, keys, set, userModel } from "../../DB";
import { Ilogout, IupdatePassword } from "./user.dto";
import { revokeTokenKey } from "../../middleware/auth.middleware";
import { HASH_ROUND } from "../../.env/cofig.env";
import { DBrepo } from "../../DB/model/repo";
import { IUser } from "../../common/interfaces";


export class userService{
  private  userRepo:DBrepo<IUser>
    constructor(){
      this.userRepo=new DBrepo(userModel)
    }
    public updatePassword=async(data:IupdatePassword)=>{
        const {id,oldPassword,password}=data
        const user=await this.userRepo.findOneM({data:{_id:id},projection:{}})
        if(!user)throw new notFoundException("user not found")
        const wrongPassword=!await compare(oldPassword,user.password as string)
        if(wrongPassword)throw new notFoundException("wrong password")
        const samePassword=await compare(password, user.password as string)
              if (samePassword) {
    throw new BadRequestException("user password must not be the same with old password")
  }

        user.password=await hash(password,HASH_ROUND )
        user.save()

    }
    public logout=async(data:Ilogout)=>{
        const {id,decoded,flag}=data
        console.log( flag);
        
        const user= await this.userRepo.findOneM({data:{_id:id},projection:{}})
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
     public getProfile=async(id:string)=>{
      const user = await this.userRepo.findOneM({data:{_id:id},projection:{}})
      return user
    }
}
export default new userService()