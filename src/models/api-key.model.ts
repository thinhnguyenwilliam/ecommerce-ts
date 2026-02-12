// src/models/api-key.model.ts
import { Schema, model, Document } from 'mongoose';

const DOCUMENT_NAME = 'ApiKey';
const COLLECTION_NAME = 'ApiKeys';

export interface ApiKey extends Document {
  key: string;
  status: boolean;
  permissions: string[];
}

const apiKeySchema = new Schema<ApiKey>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    status: {
      type: Boolean,
      default: true
    },
    permissions: {
      type: [String],
      required: true,
      enum: ['0000', '1111', '2222','3333','4444']
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

export default model<ApiKey>(DOCUMENT_NAME, apiKeySchema);
