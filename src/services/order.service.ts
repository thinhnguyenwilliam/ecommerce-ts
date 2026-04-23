// ecommerce-ts/src/services/order.service.ts

import { Types } from "mongoose";
import { CartModel } from "../models/cart.model";
import { OrderModel } from "../models/order.model";
import * as InventoryRepo from "../repository/inventory.repo";
import { BadRequestError, NotFoundError } from "../core/error.response";

class OrderService {

     // 🔥 check idempotency
    static async checkExistByKey(key: string) {
        return await OrderModel.findOne({ idempotencyKey: key }).lean();
    }

    //
    // 🔥 Commit Order
    //
    static async createOrder({
        userId,
        checkoutData,
    }: {
        userId: string;
        checkoutData: any; // từ checkoutReview
    }) {
        // 1. validate cart vẫn tồn tại
        const cart = await CartModel.findOne({
            userId,
            state: "active",
        });

        if (!cart) throw new NotFoundError("Cart not found");

        // 2. tạo order
        const order = await OrderModel.create({
            userId: new Types.ObjectId(userId),
            items: checkoutData.products.map((p: any) => ({
                productId: new Types.ObjectId(p.productId),
                quantity: p.quantity,
                price: p.price,
            })),
            totalPrice: checkoutData.totalPrice,
            discount: checkoutData.discount,
            finalPrice: checkoutData.finalPrice,
            status: "pending",
        });

        // 3. confirm inventory (chuyển reservation → confirmed)
        for (const item of checkoutData.products) {
            await InventoryRepo.confirmReservation({
                productId: item.productId,
                userId,
            });
        }

        // 4. clear cart
        cart.items = [];
        cart.state = "ordered";
        await cart.save();

        return order;
    }
}

export default OrderService;