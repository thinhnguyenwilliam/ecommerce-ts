// ecommerce-ts/src/models/reservation.model.ts

import { Schema, model, Types, Document } from "mongoose";

export interface IReservation extends Document {
    productId: Types.ObjectId;
    shopId: Types.ObjectId;
    orderId: string;
    quantity: number;
    status: "pending" | "confirmed" | "cancelled";
    expiresAt: Date;
}

const DOCUMENT_NAME = "Reservation";
const COLLECTION_NAME = "Reservations";

const reservationSchema = new Schema<IReservation>(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        shopId: {
            type: Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        },
        orderId: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending",
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: true,
    }
);

//
// 🔥 INDEX QUAN TRỌNG
//

// tìm reservation theo product nhanh
reservationSchema.index({ productId: 1, shopId: 1 });

// auto expire (Mongo TTL)
reservationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const ReservationModel = model<IReservation>(
    DOCUMENT_NAME,
    reservationSchema
);