// ecommerce-ts/src/services/message.service.ts
export const messageService = {
  async handle(message: string): Promise<void> {
    console.log("⚙️ Handling message:", message);
    // xử lý DB, gọi API, gửi email, ...
  },
};