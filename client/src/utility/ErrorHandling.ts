export class ErrorHandling extends Error {
    constructor(public readonly status: number, message: string) {
        super(message);
        Object.setPrototypeOf(this, ErrorHandling.prototype);
    }
}
