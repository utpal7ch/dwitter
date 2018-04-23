
export class DbResult {
    errors: ValidationError[];
    result: any;

    constructor(errors: ValidationError[], result: any) {
        this.errors = errors;
        this.result = result;
    }
}

export class ValidationError {
    key: String;
    message: String;
}