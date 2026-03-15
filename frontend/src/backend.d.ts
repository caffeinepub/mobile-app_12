import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface CartItem {
    productId: string;
    quantity: bigint;
}
export interface Order {
    id: string;
    status: OrderStatus;
    userId: Principal;
    totalAmount: bigint;
    shippingAddress: string;
    items: Array<CartItem>;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export interface Product {
    id: string;
    name: string;
    description: string;
    stock: bigint;
    category: string;
    image: ExternalBlob;
    price: bigint;
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<void>;
    addToCart(productId: string, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkout(shippingAddress: string): Promise<string>;
    deleteProduct(productId: string): Promise<void>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getLowStockProducts(threshold: bigint): Promise<Array<Product>>;
    getOrder(orderId: string): Promise<Order | null>;
    getProduct(productId: string): Promise<Product | null>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getUserOrders(): Promise<Array<Order>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeFromCart(productId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchProducts(searchTerm: string): Promise<Array<Product>>;
    updateProduct(product: Product): Promise<void>;
}
