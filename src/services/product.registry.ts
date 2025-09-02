import { Electronics, Furniture } from "./product.classes";

// chỉ export object map, không import lại ngược
export const productRegistry: Record<string, new (payload: any) => any> = {
    Electronics,
    Furniture,
};
