// ecommerce-ts/src/models/order.model.ts

import { Schema, model, Types } from "mongoose";

export interface IOrderItem {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
    idempotencyKey: {
        type: String,
        unique: true,
        index: true,
    }
}

export interface IOrder {
    userId: Types.ObjectId;
    items: IOrderItem[];
    totalPrice: number;
    discount: number;
    finalPrice: number;

    status: "pending" | "confirmed" | "cancelled";

    paymentStatus: "unpaid" | "paid";
}

const orderSchema = new Schema<IOrder>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },

        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: "Product" },
                quantity: Number,
                price: Number,
            },
        ],

        totalPrice: Number,
        discount: Number,
        finalPrice: Number,

        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending",
        },

        paymentStatus: {
            type: String,
            enum: ["unpaid", "paid"],
            default: "unpaid",
        },
    },
    {
        collection: "Orders",
        timestamps: true,
    }
);

export const OrderModel = model<IOrder>("Order", orderSchema);