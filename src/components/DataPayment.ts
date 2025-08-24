import { Form } from "./Form";
import { IEvents } from "./base/events";

export interface IDataPayment {
  payment: string;
  address: string;
}

export class DataPayment extends Form<IDataPayment> {
  constructor(form: HTMLFormElement, events: IEvents) {
    super(form, events);

    
    const paymentButtons = form.querySelectorAll<HTMLButtonElement>(".order__buttons button");
    paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const payment = button.name as IDataPayment['payment'];
        this.onInputChange("payment", payment);
      });
    });

    this.activateToggleButtons(".order__buttons button");
  }

  set address(value: string) {
    this.setFieldValue("address", value);
  }
}
