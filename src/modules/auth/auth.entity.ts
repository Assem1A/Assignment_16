import mongoose from "mongoose"
import { GenderEnum } from "../../common/enums"

export interface IloginGeneric {
  token: string
  refreshToken:string
}
export interface ISignupGeneric extends IConfirmEmailGeneric {
username:String |undefined
gender:GenderEnum
id:mongoose.Types.ObjectId

}
export interface IConfirmEmailGeneric {
    email:String
}
