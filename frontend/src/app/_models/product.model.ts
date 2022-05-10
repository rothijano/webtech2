import { User } from "./user.model";

export interface Product {
    _id: string;
    name: string;
    description: string;
    quantity: number;
    price: number;
    isActive: boolean;
    creator: User;
}