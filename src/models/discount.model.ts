// ecommerce-ts/src/models/discount.model.ts

import { Schema, model, Types } from "mongoose";

// ------------------------
// Interface
// ------------------------
export interface IDiscount {
    discount_name: string;
    discount_description?: string;
    discount_type: "fixed_amount" | "percentage";
    discount_value: number;
    discount_code: string;

    discount_start_date: Date;
    discount_end_date: Date;

    discount_max_uses: number;
    discount_uses_count: number;

    discount_max_uses_per_user: number;
    discount_min_order_value: number;

    discount_shopId: Types.ObjectId;

    discount_is_active: boolean;

    discount_apply_to: "all" | "specific";
    discount_product_ids: Types.ObjectId[];
}

// ------------------------
// Schema
// ------------------------
const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

const discountSchema = new Schema<IDiscount>(
    {
        discount_name: { type: String, required: true },
        discount_description: { type: String },

        discount_type: {
            type: String,
            enum: ["fixed_amount", "percentage"],
            required: true,
        },

        discount_value: {
            type: Number,
            required: true,
        },

        discount_code: {
            type: String,
            required: true,
            unique: true,
        },

        discount_start_date: {
            type: Date,
            required: true,
        },

        discount_end_date: {
            type: Date,
            required: true,
        },

        discount_max_uses: {
            type: Number,
            default: 0, // 0 = unlimited
        },

        discount_uses_count: {
            type: Number,
            default: 0,
        },

        discount_max_uses_per_user: {
            type: Number,
            default: 1,
        },

        discount_min_order_value: {
            type: Number,
            default: 0,
        },

        discount_shopId: {
            type: Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        },

        discount_is_active: {
            type: Boolean,
            default: true,
        },

        discount_apply_to: {
            type: String,
            enum: ["all", "specific"],
            required: true,
        },

        discount_product_ids: [
            {
                type: Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

// ------------------------
// Index (QUAN TRỌNG)
// ------------------------
discountSchema.index({ discount_code: 1, discount_shopId: 1 }, { unique: true });

// ------------------------
// Model
// ------------------------
export const DiscountModel = model<IDiscount>(
    DOCUMENT_NAME,
    discountSchema
);