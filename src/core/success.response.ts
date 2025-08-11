// src/core/success.response.ts
import { Response } from 'express';

export const StatusCode = {
    OK: 200,
    CREATED: 201,
} as const;

export const ReasonStatusCode = {
    OK: 'Success',
    CREATED: 'Created!',
} as const;

interface SuccessParams {
    message?: string;
    statusCode?: number;
    reasonStatusCode?: string;
    metadata?: Record<string, any>;
    options?: Record<string, any>;
}

export class SuccessResponse {
    message: string;
    status: number;
    metadata: Record<string, any>;
    options?: Record<string, any>;

    constructor({
        message,
        statusCode = StatusCode.OK,
        reasonStatusCode = ReasonStatusCode.OK,
        metadata = {},
        options,
    }: SuccessParams) {
        this.message = message || reasonStatusCode;
        this.status = statusCode;
        this.metadata = metadata;
        this.options = options; // ✅ store options
    }

    send(res: Response, headers: Record<string, string> = {}) {
        if (headers && Object.keys(headers).length) {
            res.set(headers);
        }
        return res.status(this.status).json({
            message: this.message,
            status: this.status,
            metadata: this.metadata,
            ...(this.options ? { options: this.options } : {}), // ✅ conditionally include
        });
    }
}

export class OK extends SuccessResponse { }


export class CREATED extends SuccessResponse {

    //Omit<SuccessParams, 'statusCode' | 'reasonStatusCode'>
    // “Take the SuccessParams type, but remove the statusCode and reasonStatusCode properties.”
    
    constructor(params: Omit<SuccessParams, 'statusCode' | 'reasonStatusCode'>) {
        super({
            ...params,
            statusCode: StatusCode.CREATED,
            reasonStatusCode: ReasonStatusCode.CREATED,
        });
    }
}
