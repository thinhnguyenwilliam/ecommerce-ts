// ecommerce-ts/src/services/cart.service.ts

import { Types } from "mongoose";
import { CartModel } from "../models/cart.model";
import { ProductModel } from "../models/product.model";
import { BadRequestError, NotFoundError } from "../core/error.response";

class CartService {
    //
    // 🟢 1. Add product to cart
    //
    static async addToCart({
        userId,
        productId,
        quantity,
    }: {
        userId: string;
        productId: string;
        quantity: number;
    }) {
        const product = await ProductModel.findById(productId);
        if (!product) throw new NotFoundError("Product not found");

        let cart = await CartModel.findOne({
            userId,
            state: "active",
        });

        // nếu chưa có cart → tạo mới
        if (!cart) {
            cart = await CartModel.create({
                userId,
                items: [
                    {
                        productId,
                        shopId: product.product_shop,
                        quantity,
                        price: product.product_price,
                    },
                ],
            });

            return cart;
        }

        // nếu đã có → update
        const item = cart.items.find(
            (i) => i.productId.toString() === productId
        );

        if (item) {
            item.quantity += quantity;
        } else {
            cart.items.push({
                productId: new Types.ObjectId(productId),
                shopId: product.product_shop!,
                quantity,
                price: product.product_price,
            });
        }

        await cart.save();
        return cart;
    }

    //
    // 🔴 2. Remove item
    //
    static async removeItem({
        userId,
        productId,
    }: {
        userId: string;
        productId: string;
    }) {
        const cart = await CartModel.findOneAndUpdate(
            { userId, state: "active" },
            {
                $pull: {
                    items: { productId: new Types.ObjectId(productId) },
                },
            },
            { new: true }
        );

        return cart;
    }

    //
    // 🟡 3. Update quantity
    //
    static async updateQuantity({
        userId,
        productId,
        quantity,
    }: {
        userId: string;
        productId: string;
        quantity: number;
    }) {
        if (quantity <= 0) throw new BadRequestError("Invalid quantity");

        const cart = await CartModel.findOne({
            userId,
            state: "active",
        });

        if (!cart) throw new NotFoundError("Cart not found");

        const item = cart.items.find(
            (i) => i.productId.toString() === productId
        );

        if (!item) throw new NotFoundError("Item not found");

        item.quantity = quantity;
        await cart.save();

        return cart;
    }

    //
    // 🔥 4. Get cart
    //
    static async getCart(userId: string) {
        return await CartModel.findOne({
            userId,
            state: "active",
        }).lean();
    }
}

export default CartService;