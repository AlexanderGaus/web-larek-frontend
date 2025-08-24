import { FormErrors, IAppState, IDataContacts, IDataPayment, IOrder } from "../types";
import { Model } from "./base/Model";

export class AppState extends Model<IAppState> {
  public order: IOrder = {
    payment: '',
    address: '',
    email: '',
    phone: '',
  };

  public errors: FormErrors = {};

  resetOrder(): void {
    for (const key in this.order) {
      if (Object.prototype.hasOwnProperty.call(this.order, key)) {
        this.order[key as keyof IOrder] = '';
      }
    }
  }

  updatePaymentData(field: keyof IDataPayment, value: string): void {
    if (!this.isString(value)) return;

    this.order[field] = value;

    if (field === 'payment') {
      this.events.emit('payment:choose');
    }

    if (this.isPaymentFormValid()) {
      this.events.emit('payment:ready');
    }
  }

  updateContactData(field: keyof IDataContacts, value: string): void {
    if (!this.isString(value)) return;

    this.order[field] = value;

    if (this.isContactFormValid()) {
      this.events.emit('contacts:ready', this.order);
    }
  }

  private isPaymentFormValid(): boolean {
    const paymentError = this.validateField('payment', this.order.payment, 'Необходимо указать способ оплаты');
    const addressError = this.validateField('address', this.order.address, 'Необходимо указать адрес');

    const errors = {
      ...(paymentError && { payment: paymentError }),
      ...(addressError && { address: addressError }),
    };

    this.errors = errors;
    this.events.emit('formPaymentErrors:change', this.errors);

    return Object.keys(errors).length === 0;
  }

  private isContactFormValid(): boolean {
    const emailError = this.validateField('email', this.order.email, 'Необходимо указать email');
    const phoneError = this.validateField('phone', this.order.phone, 'Необходимо указать телефон');

    const errors = {
      ...(emailError && { email: emailError }),
      ...(phoneError && { phone: phoneError }),
    };

    this.errors = errors;
    this.events.emit('formContactsErrors:change', this.errors);

    return Object.keys(errors).length === 0;
  }

  private validateField(field: keyof IOrder, value: string, message: string): string | null {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      return message;
    }
    return null;
  }

  
  private isString(value: unknown): value is string {
    return typeof value === 'string';
  }
}
