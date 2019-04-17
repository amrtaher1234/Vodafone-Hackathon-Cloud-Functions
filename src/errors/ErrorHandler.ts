import { MyError } from "./MyError";
import { UndefinedError } from "./UndefinedError";

export class ErrorHandler {
  static handleError(error: Error){
      if (error instanceof MyError){
          return error;
      } else {
          return new UndefinedError(error);
      }
  }
}