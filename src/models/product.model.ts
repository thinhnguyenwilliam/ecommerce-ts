// src/models/product.model.ts
import { Schema, model, Document, Types } from "mongoose";

// ------------------------
// Interfaces for TypeScript
// ------------------------
export interface IProduct extends Document {
    product_name: string;
    product_thumb: string;
    product_description?: string;
    product_price: number;
    product_quantity: number;
    product_type: "Electronics" | "Clothing" | "Furniture";
    product_shop?: Types.ObjectId;
    product_attributes: Record<string, any>;
}

// ------------------------
// Sub-schemas
// ------------------------
const clothingSchema = new Schema(
    {
        brand: { type: String, required: true },
        size: { type: String },
        material: { type: String },
    },
    { collection: "Clothes", timestamps: true }
);

const electronicSchema = new Schema(
    {
        manufacturer: { type: String, required: true },
        model: { type: String },
        color: { type: String },
    },
    { collection: "Electronics", timestamps: true }
);

// ------------------------
// Main Product Schema
// ------------------------
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema<IProduct>(
    {
        product_name: { type: String, required: true },
        product_thumb: { type: String, required: true },
        product_description: { type: String },
        product_price: { type: Number, required: true },
        product_quantity: { type: Number, required: true },
        product_type: {
            type: String,
            required: true,
            enum: ["Electronics", "Clothing", "Furniture"],
        },
        product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
        product_attributes: { type: Schema.Types.Mixed, required: true },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

// ------------------------
// Models
// ------------------------
export const ProductModel = model<IProduct>(DOCUMENT_NAME, productSchema);
export const ClothingModel = model("Clothing", clothingSchema);
export const ElectronicModel = model("Electronic", electronicSchema);
