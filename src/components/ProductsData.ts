import { IProduct, IProductsData } from "../types";
import { IEvents } from "./base/events";

export class ProductsData implements IProductsData {
    private productList: IProduct[] = [];
    private currentPreviewId: string | null = null;

    constructor(protected events: IEvents) {}


    set items(products: IProduct[]) {
        this.productList = products;
        this.events.emit('catalog:changed', { items: this.items });
    }

    get items(): IProduct[] {
        return this.productList;
    }

    getProduct(productId: string): IProduct {
        const product = this.productList.find(item => item.id === productId);
        if (!product) {
            throw new Error(`Продукт с id ${productId} не найден`);
        }
        
        return product;
    }

    getProducts(): IProduct[] {
        return [...this.productList];
    }

    set preview(id: string | null) {
        if (!id) {
            this.currentPreviewId = null;
            return;
        }

        try {
            this.getProduct(id);
            this.currentPreviewId = id;
            this.events.emit('card:selected');
        } catch {
            this.currentPreviewId = null;
        }
    }


    get preview(): string | null {
        return this.currentPreviewId;
    }
}
