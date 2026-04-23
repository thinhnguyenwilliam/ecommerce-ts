// ecommerce-ts/src/repository/inventory.repo.ts

import { Types } from "mongoose";
import { InventoryModel } from "../models/inventory.model";
import { ReservationModel } from "../models/reservation.model";




export const reserveInventory = async ({
    productId,
    quantity,
    userId,
}: {
    productId: string;
    quantity: number;
    userId: string;
}) => {
    const updated = await InventoryModel.findOneAndUpdate(
        {
            inven_productId: new Types.ObjectId(productId),
            inven_stock: { $gte: quantity },
        },
        {
            $inc: {
                inven_stock: -quantity,
            },
            $push: {
                inven_reservations: {
                    orderId: userId, // tạm
                    quantity,
                    createdAt: new Date(),
                },
            },
        },
        { new: true }
    );

    return updated;
};

//
// 🟢 1. Create Inventory
//
export const insertInventory = async ({
    productId,
    shopId,
    stock,
    location = "default",
}: {
    productId: string;
    shopId: string;
    stock: number;
    location?: string;
}) => {
    return await InventoryModel.create({
        inven_productId: new Types.ObjectId(productId),
        inven_shopId: new Types.ObjectId(shopId),
        inven_stock: stock,
        inven_location: location,
    });
};

//
// 🟡 2. Get available stock (VERY IMPORTANT)
//
export const getAvailableStock = async ({
    productId,
    shopId,
}: {
    productId: string;
    shopId: string;
}) => {
    const inventory = await InventoryModel.findOne({
        inven_productId: productId,
        inven_shopId: shopId,
    }).lean();

    if (!inventory) return 0;

    // tổng reservation pending
    const reserved = await ReservationModel.aggregate([
        {
            $match: {
                productId: new Types.ObjectId(productId),
                shopId: new Types.ObjectId(shopId),
                status: "pending",
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$quantity" },
            },
        },
    ]);

    const reservedQty = reserved[0]?.total || 0;

    return inventory.inven_stock - reservedQty;
};

//
// 🔥 3. Reserve stock (QUAN TRỌNG NHẤT)
//
export const reserveStock = async ({
    productId,
    shopId,
    orderId,
    quantity,
}: {
    productId: string;
    shopId: string;
    orderId: string;
    quantity: number;
}) => {
    const available = await getAvailableStock({ productId, shopId });

    if (available < quantity) {
        throw new Error("Not enough stock");
    }

    return await ReservationModel.create({
        productId,
        shopId,
        orderId,
        quantity,
        status: "pending",
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 phút
    });
};

//
// 🟢 4. Confirm reservation (payment success)
//
// export const confirmReservation = async ({
//     orderId,
// }: {
//     orderId: string;
// }) => {
//     const reservation = await ReservationModel.findOne({
//         orderId,
//         status: "pending",
//     });

//     if (!reservation) {
//         throw new Error("Reservation not found");
//     }

//     // trừ stock thật
//     await InventoryModel.updateOne(
//         {
//             inven_productId: reservation.productId,
//             inven_shopId: reservation.shopId,
//         },
//         {
//             $inc: { inven_stock: -reservation.quantity },
//         }
//     );

//     // update status
//     reservation.status = "confirmed";
//     await reservation.save();

//     return reservation;
// };

export const confirmReservation = async ({
    productId,
    userId,
}: {
    productId: string;
    userId: string;
}) => {
    return await InventoryModel.updateOne(
        {
            inven_productId: new Types.ObjectId(productId),
            "inven_reservations.orderId": userId,
        },
        {
            $set: {
                "inven_reservations.$.status": "confirmed",
            },
        }
    );
};


//
// 🔴 5. Release reservation (cancel / timeout)
//
// export const releaseReservation = async ({
//     orderId,
// }: {
//     orderId: string;
// }) => {
//     return await ReservationModel.findOneAndUpdate(
//         {
//             orderId,
//             status: "pending",
//         },
//         {
//             status: "cancelled",
//         },
//         { new: true }
//     );
// };

export const releaseReservation = async ({
    productId,
    userId,
}: {
    productId: string;
    userId: string;
}) => {
    return await InventoryModel.findOneAndUpdate(
        {
            inven_productId: new Types.ObjectId(productId),
        },
        {
            $inc: { inven_stock: 1 },
            $pull: {
                inven_reservations: { orderId: userId },
            },
        }
    );
};