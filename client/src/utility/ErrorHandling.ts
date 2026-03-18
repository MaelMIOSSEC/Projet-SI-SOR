export class ErrorHandling extends Error {
    constructor(private status: number, private message: string) {
        super(message);
        Object.setPrototypeOf(this, ErrorHandling.prototype);
    }
}
