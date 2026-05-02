import { GenderEnum } from "../../common/enums"

export interface IloginGeneric {
  token: String
  refreshToken:String
}
export interface ISignupGeneric extends IConfirmEmailGeneric {
username:String |undefined
gender:GenderEnum

}
export interface IConfirmEmailGeneric {
    email:String
}
