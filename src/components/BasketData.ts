import { IProduct, IBasketData } from "../types";
import { IEvents } from "./base/events";

export class BasketData implements IBasketData {
  private products: IProduct[] = [];
  private event: IEvents;

  constructor(evt: IEvents) {
    this.event = evt;
  }

  set items(value: IProduct[]) {
    this.products = value;
    this.event.emit("basket:changed", { items: this.products });
  }

  get items(): IProduct[] {
    return this.products;
  }

  getProduct(id: string): IProduct | undefined {
    return this.products.find(product => product.id === id);
  }

  addProduct(product: IProduct): void {
    const alreadyExists = this.products.some(p => p.id === product.id);

    if (!alreadyExists) {
      this.products.unshift(product);
      this.event.emit("basket:changed", { items: this.products });
    } else {
      console.warn(`Товар с ID${product.id} уже в корзине.`);
    }
  }

  removeProduct(id: string, callback?: () => void): void {
    const originalCount = this.products.length;
    this.products = this.products.filter(p => p.id !== id);

    if (this.products.length < originalCount) {
      this.event.emit("basket:changed", { items: this.products });
      callback?.();
    } else {
      console.warn(`Товар с ID ${id} не найден в корзине.`);
    }
  }

  getTotal(): number {
    return this.products.reduce((sum, product) => sum + (product.price || 0), 0);
  }

  reset(): void {
    this.products = [];
    this.event.emit("basket:changed", { items: this.products });
  }
}
