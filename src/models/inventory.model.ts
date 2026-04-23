// ecommerce-ts/src/models/inventory.model.ts

import { Schema, model, Types, Document } from "mongoose";

export interface IInventory extends Document {
    inven_productId: Types.ObjectId;
    inven_location: string;
    inven_stock: number;
    inven_shopId: Types.ObjectId;
}

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

const inventorySchema = new Schema<IInventory>(
    {
        inven_productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        inven_location: {
            type: String,
            default: "default",
        },
        inven_stock: {
            type: Number,
            required: true,
        },
        inven_shopId: {
            type: Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

// unique inventory per product + shop
inventorySchema.index({ inven_productId: 1, inven_shopId: 1 }, { unique: true });

export const InventoryModel = model<IInventory>(
    DOCUMENT_NAME,
    inventorySchema
);