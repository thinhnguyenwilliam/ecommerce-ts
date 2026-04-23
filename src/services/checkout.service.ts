// ecommerce-ts/src/services/checkout.service.ts

import { CartModel } from "../models/cart.model";
import { ProductModel } from "../models/product.model";
import DiscountService from "./discount.service";
import * as InventoryRepo from "../repository/inventory.repo";
import { BadRequestError, NotFoundError } from "../core/error.response";
import InventoryService from "./inventory.service";

class CheckoutService {
    static async checkoutReview({
        userId,
        discountCode,
    }: {
        userId: string;
        discountCode?: string;
    }) {
        // 1. lấy cart
        const cart = await CartModel.findOne({
            userId,
            state: "active",
        });

        if (!cart || cart.items.length === 0) {
            throw new NotFoundError("Cart is empty");
        }

        // 2. validate product + tính giá
        let products: any[] = [];
        let totalPrice = 0;

        for (const item of cart.items) {
            const product = await ProductModel.findById(item.productId);

            if (!product) {
                throw new BadRequestError("Product not found");
            }

            if (!product.isPublished) {
                throw new BadRequestError("Product not available");
            }

            // ⚠️ validate lại giá (không trust cart)
            const currentPrice = product.product_price;

            const itemTotal = currentPrice * item.quantity;

            totalPrice += itemTotal;

            products.push({
                productId: product.id,
                price: currentPrice,
                quantity: item.quantity,
                shopId: product.product_shop?.toString(),
            });
        }

        // 3. apply discount (optional)
        let discountResult = null;

        if (discountCode) {
            discountResult = await DiscountService.applyDiscount({
                code: discountCode,
                userId,
                shopId: products[0].shopId, // đơn giản: 1 shop
                products,
            });
        }

        const finalPrice = discountResult
            ? discountResult.finalPrice
            : totalPrice;

        // 4. 🔥 reserve inventory
        for (const item of products) {
            const reserved = await InventoryService.reserveWithLock({
                productId: item.productId,
                quantity: item.quantity,
                userId,
            });

            if (!reserved) {
                throw new BadRequestError(
                    `Product ${item.productId} out of stock`
                );
            }
        }

        return {
            totalPrice,
            discount: discountResult?.discountAmount || 0,
            finalPrice,
            products,
        };
    }
}

export default CheckoutService;