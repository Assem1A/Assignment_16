export interface IloginGeneric {
  token: string
  refreshToken:string
}
export interface ISignupGeneric extends IConfirmEmailGeneric {
username:string 
gender:string

}
export interface IConfirmEmailGeneric {
    email:string
}
