import { AppExceptions } from "./app.exceptions"

        export class BadRequestException extends AppExceptions{
        constructor(message: string="BadRequest",cause?:ErrorOptions){
            super(message,400,cause)
        }
    }
            export class conflictException extends AppExceptions{
        constructor(message: string="conflict",cause?:ErrorOptions){
            super(message,409,cause)
        }
    }
                export class notFoundException extends AppExceptions{
        constructor(message: string="NotFound",cause?:ErrorOptions){
            super(message,404,cause)
        }
    }
                   export class unAuthorizedException extends AppExceptions{
        constructor(message: string="unAuthorized",cause?:ErrorOptions){
            super(message,401,cause)
        }
    }
              export class forbiddenException extends AppExceptions{
        constructor(message: string="forbidden",cause?:ErrorOptions){
            super(message,403,cause)
        }
    }