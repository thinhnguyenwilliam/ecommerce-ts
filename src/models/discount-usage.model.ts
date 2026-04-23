// ecommerce-ts/src/models/discount-usage.model.ts

import { Schema, model, Types } from "mongoose";

export interface IDiscountUsage {
    userId: Types.ObjectId;
    discountId: Types.ObjectId;
    orderId: Types.ObjectId;
}

const DOCUMENT_NAME = "DiscountUsage";
const COLLECTION_NAME = "DiscountUsages";

const discountUsageSchema = new Schema<IDiscountUsage>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        discountId: {
            type: Schema.Types.ObjectId,
            ref: "Discount",
            required: true,
        },
        orderId: {
            type: Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

//
// 🔥 QUAN TRỌNG: mỗi user chỉ dùng 1 lần
//
discountUsageSchema.index(
    { userId: 1, discountId: 1 },
    { unique: true }
);

export const DiscountUsageModel = model<IDiscountUsage>(
    DOCUMENT_NAME,
    discountUsageSchema
);