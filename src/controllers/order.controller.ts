// src/controllers/order.controller.ts
import { Request, Response } from "express";
import OrderPublisher from "../services/order.publisher";

export const createOrder = async (req: Request, res: Response) => {
  const payload = {
    userId: req.user.userId,
    checkoutData: req.body,
    idempotencyKey: req.headers["x-idempotency-key"] || Date.now().toString(),
  };

  await OrderPublisher.publishCreateOrder(payload);

  return res.status(202).json({
    message: "Order is being processed",
  });
};