// src/models/shop.model.ts
import { Schema, model, Document } from 'mongoose';

export interface IShop extends Document {
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    status: 'active' | 'inactive';
    verify: boolean;
    roles: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ShopSchema = new Schema<IShop>(
    {
        name: { type: String, required: true, trim: true, maxlength: 150 },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
        verify: { type: Boolean, default: false },
        roles: { type: [String], default: [] }
    },
    {
        timestamps: true,
        collection: 'Shops' // 👈 explicitly name the collection
    }
);

export const Shop = model<IShop>('Shop', ShopSchema);
