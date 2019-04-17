import { BAD_REQUEST, UNAUTHORIZED } from "./ErrorCodes";

export abstract class MyError extends Error {
    public code: number;
    __proto__: Error;
    constructor(message :string) {
        const trueProto = new.target.prototype;
        super(message);
        this.name = this.constructor.name; 
        this.stack= null;
        this.__proto__ = trueProto;
        this.__proto__.stack = null ; 

      }
}


export abstract class ValidationError extends MyError{
    // ** //
        code = BAD_REQUEST; 
}
export class HttpMethodError extends ValidationError{
    public method : string; 
    constructor(method : string){
        super("Should be a " + method + " http request");
        this.method = method; 
    }
}
export class PropertyRequiredError extends ValidationError{
    public property : string; 
    
    constructor(property : string){
        super("No property " + property); 
        this.property = property; 
    }
}
export enum DateErrors{
    badFormat = "Bad Format",
    futureDate = "Future Date",
    outRangeDate = "Out Range Date",
}
export class DateValidationError extends ValidationError{

    constructor(dateError : DateErrors){
        super(dateError.toString());
         
    }
}

export class NotFoundError extends ValidationError{
    constructor(id , collection){
        super(id + " of collection/document " + collection + " is not found"); 
    }
}

export class AlreadyExsistError extends MyError{
    code = 409; // read about this more here. https://tools.ietf.org/html/rfc7231#page-58 
    constructor(resource){
        super("Already this " + resource + " exsists and can't be re-submitted/re=created/");
    }   
}

export abstract class AuthorizationError extends MyError{
    code = UNAUTHORIZED; 
}

export class UnauthorizedAdminOperationError extends AuthorizationError{
    constructor(adminID , operationName){
        super("admin with id " + adminID + " is not authorized for the function " +operationName ); 
    }
}
export class UnauthorizedUserOperationError extends AuthorizationError {
    constructor(uid , operationName){
        super("user with id " + uid + " is not authorized for the function " +operationName ); 
    }
}



// when you want to add new error class create a sub main class to inherit from MyError class and then sub classes to your main sub class.
// your main sub class should have a code error initialized, do not add seperate codes for inner sub classes.


