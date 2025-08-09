// src/core/error.response.ts

export const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409,
} as const;

export const ReasonStatusCode = {
    FORBIDDEN: 'Bad Request Error',
    CONFLICT: 'Conflict Error',
} as const;

export class ErrorResponse extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;

        // Fix prototype chain for `instanceof` checks
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class ConflictRequestError extends ErrorResponse {
    constructor(
        message: string = ReasonStatusCode.CONFLICT,
        statusCode: number = StatusCode.CONFLICT
    ) {
        super(message, statusCode);
    }
}

export class BadRequestError extends ErrorResponse {
    constructor(
        message: string = ReasonStatusCode.FORBIDDEN,
        statusCode: number = StatusCode.FORBIDDEN
    ) {
        super(message, statusCode);
    }
}
