export class UndefinedError extends Error {
    public code: number;
    public error ;

    constructor(error) {
        super("Internal Server Error.Please try again.");
        this.error = error;
        this.code = 500;
      }
}