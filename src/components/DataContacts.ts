import { Form } from "./Form";
import { IEvents } from "./base/events";

export interface IDataContacts {
  email: string;
  phone: string;
}

export class DataContacts extends Form<IDataContacts> {
  constructor(form: HTMLFormElement, events: IEvents) {
    super(form, events);
  }

  set email(value: string) {
    this.setFieldValue("email", value);
  }

  set phone(value: string) {
    this.setFieldValue("phone", value);
  }
}
