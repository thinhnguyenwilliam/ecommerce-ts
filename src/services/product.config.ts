import { Electronic, Furniture } from "./product.service.v2";

// export một object mapping type -> class
export const productConfig: Record<string, new (payload: any) => any> = {
    Electronic,
    Furniture,
};
