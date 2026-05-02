    export class AppExceptions extends Error{
        constructor(message: string,public statusCode:number,cause?:ErrorOptions){
            super(message,{cause})
            this.name=this.constructor.name
        }
    }
