export interface ILoginDTO extends Iemail{

    password:string
}
export interface ISignupDTO extends ILoginDTO{
    username:string
    gender:string
}
export interface IConfirmEmailDTO extends Iemail{

    otp:string
}
export interface Iemail{
    email:string
}
export interface IForgetPassword extends ILoginDTO{
otp:string
}