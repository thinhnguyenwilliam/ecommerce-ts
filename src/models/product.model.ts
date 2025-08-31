// src/models/product.model.ts
import { Schema, model, Document, Types } from "mongoose";
import slugify from "slugify";
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
    product_slug?: string;
    product_ratingsAverage?: number;
    isDraft?: boolean;
    isPublished?: boolean;
    product_variation?: string[];
}

// ------------------------
// Sub-schemas
// ------------------------
const clothingSchema = new Schema(
    {
        brand: { type: String, required: true },
        size: { type: String },
        material: { type: String },
        product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    },
    { collection: "Clothes", timestamps: true }
);

const electronicSchema = new Schema(
    {
        manufacturer: { type: String, required: true },
        model: { type: String },
        color: { type: String },
        product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    },
    { collection: "Electronics", timestamps: true }
);

const furnitureSchema = new Schema(
    {
        brand: { type: String, required: true },
        size: { type: String },
        material: { type: String },
        product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    },
    { collection: "Furnitures", timestamps: true }
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
        product_slug: { type: String },
        product_ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must be above 1.0'],
            max: [5, 'Rating must be below 5.0'],
            set: (val: number) => Math.round(val * 10) / 10
        },
        isDraft: { type: Boolean, default: true, index: true, select: true },
        isPublished: { type: Boolean, default: false, index: true, select: true },
        product_variation: { type: [String], default: [] },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

// Middleware: generate slug before save
productSchema.pre<IProduct>("save", function (next) {
    if (this.isModified("product_name")) {
        this.product_slug = slugify(this.product_name, { lower: true, strict: true });
    }
    next();
});

// ------------------------
// Models
// ------------------------
export const ProductModel = model<IProduct>(DOCUMENT_NAME, productSchema);
export const ClothingModel = model("Clothing", clothingSchema);
export const ElectronicModel = model("Electronic", electronicSchema);
export const FurnitureModel = model("Furniture", furnitureSchema);
