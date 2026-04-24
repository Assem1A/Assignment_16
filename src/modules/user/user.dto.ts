export interface IupdatePassword{
    id:string|undefined
    oldPassword:string
    password:string
}
export interface Ilogout{
    flag:number|undefined
    id:string|undefined
    decoded: {
        jti: string|undefined;
        iat: number|undefined;
        exp: number|undefined;
      }|undefined
}