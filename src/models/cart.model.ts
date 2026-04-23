// ecommerce-ts/src/models/cart.model.ts

import { Schema, model, Types } from "mongoose";

export interface ICartItem {
    productId: Types.ObjectId;
    shopId: Types.ObjectId;
    quantity: number;
    price: number;
}

export interface ICart {
    userId: Types.ObjectId;
    items: ICartItem[];
    state: "active" | "ordered";
}

const cartSchema = new Schema<ICart>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                },
                shopId: {
                    type: Schema.Types.ObjectId,
                    ref: "Shop",
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],
        state: {
            type: String,
            enum: ["active", "ordered"],
            default: "active",
        },
    },
    {
        timestamps: true,
        collection: "Carts",
    }
);

export const CartModel = model<ICart>("Cart", cartSchema);