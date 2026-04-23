// ecommerce-ts/src/services/discount.service.ts

import { Types } from "mongoose";
import { DiscountModel } from "../models/discount.model";
import { DiscountUsageModel } from "../models/discount-usage.model";
import { BadRequestError, NotFoundError } from "../core/error.response";

class DiscountService {
    //
    // 🔥 1. Create Discount
    //
    static async createDiscount(payload: any) {
        const discount = await DiscountModel.create(payload);
        return discount;
    }

    //
    // 🔥 2. Apply Discount (CORE)
    //
    static async applyDiscount({
        code,
        userId,
        shopId,
        products,
    }: {
        code: string;
        userId: string;
        shopId: string;
        products: { productId: string; price: number; quantity: number }[];
    }) {
        // 1. tìm discount
        const discount = await DiscountModel.findOne({
            discount_code: code,
            discount_shopId: shopId,
        });

        if (!discount) throw new NotFoundError("Discount not found");

        // 2. check active + date
        const now = new Date();
        if (
            !discount.discount_is_active ||
            now < discount.discount_start_date ||
            now > discount.discount_end_date
        ) {
            throw new BadRequestError("Discount expired or inactive");
        }

        // 3. check user đã dùng chưa
        const used = await DiscountUsageModel.findOne({
            userId,
            discountId: discount._id,
        });

        if (used) {
            throw new BadRequestError("User already used this discount");
        }

        // 4. tính total order
        const orderTotal = products.reduce(
            (sum, p) => sum + p.price * p.quantity,
            0
        );

        // 5. check min order value
        if (orderTotal < discount.discount_min_order_value) {
            throw new BadRequestError("Order value not eligible");
        }

        // 6. check apply_to
        if (discount.discount_apply_to === "specific") {
            const valid = products.some((p) =>
                discount.discount_product_ids.some(
                    (id) => id.toString() === p.productId
                )
            );

            if (!valid) {
                throw new BadRequestError("Discount not applicable to products");
            }
        }

        // 7. 🔥 atomic check + increment usage
        const updated = await DiscountModel.findOneAndUpdate(
            {
                _id: discount._id,
                discount_is_active: true,
                ...(discount.discount_max_uses > 0 && {
                    discount_uses_count: {
                        $lt: discount.discount_max_uses,
                    },
                }),
            },
            {
                $inc: { discount_uses_count: 1 },
            },
            { new: true }
        );

        if (!updated) {
            throw new BadRequestError("Discount exhausted");
        }

        // 8. tính discount
        let discountAmount = 0;

        if (discount.discount_type === "fixed_amount") {
            discountAmount = discount.discount_value;
        } else {
            discountAmount =
                (orderTotal * discount.discount_value) / 100;
        }

        // 9. lưu usage
        await DiscountUsageModel.create({
            userId: new Types.ObjectId(userId),
            discountId: discount._id,
            orderId: new Types.ObjectId(), // tạm (sẽ thay bằng order thật)
        });

        return {
            totalOrder: orderTotal,
            discountAmount,
            finalPrice: Math.max(orderTotal - discountAmount, 0),
        };
    }
}

export default DiscountService;