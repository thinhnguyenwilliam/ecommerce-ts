// src/models/key-token.model.ts
import { Schema, model, Document, Types } from 'mongoose';

export const DOCUMENT_NAME = 'Key';
export const COLLECTION_NAME = 'Keys';

export interface IKeyToken extends Document {
    user: Types.ObjectId;
    publicKey: string;
    privateKey: string;
    refreshTokens: string[];
}

const KeyTokenSchema = new Schema<IKeyToken>(
    {
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Shop' // Must match your Shop model name
        },
        publicKey: {
            type: String,
            required: true
        },
        privateKey: {
            type: String,
            required: true
        },
        refreshTokens: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
);

export const Key = model<IKeyToken>(DOCUMENT_NAME, KeyTokenSchema);
