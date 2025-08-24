import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

export interface IFormState {
  valid: boolean;
  errors: string[];
}

export class Form<T> extends Component<IFormState> {
  protected _submit: HTMLButtonElement;
  protected _errors: HTMLElement;
  protected _form: HTMLFormElement;

  constructor(form: HTMLFormElement, protected events: IEvents) {
    super(form);
    this._form = form;

    this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this._form);
    this._errors = ensureElement<HTMLElement>('.form__errors', this._form);

    this._form.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.name) {
        const field = target.name as keyof T;
        this.onInputChange(field, target.value);
      }
    });

    this._form.addEventListener('submit', (e: Event) => {
      e.preventDefault();
      this.events.emit(`${this._form.name}:submit`);
    });
  }

  protected onInputChange(field: keyof T, value: string) {
    this.events.emit(`${this._form.name}.${String(field)}:change`, {
      field,
      value,
    });
  }

  set valid(value: boolean) {
    this._submit.disabled = !value;
  }

  set errors(value: string) {
    this.setText(this._errors, value);
  }

  protected activateToggleButtons(selector: string) {
    const buttons = this._form.querySelectorAll<HTMLButtonElement>(selector);
    
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => this.toggleClass(b, 'button_alt-active', b === btn));
      });
    });
  }

  render(state: Partial<T> & IFormState) {
    const { valid, errors, ...inputs } = state;
    super.render({ valid, errors });
    Object.assign(this, inputs);
    return this._form;

  }

  protected setFieldValue(name: string, value: string) {
    const input = this._form.elements.namedItem(name) as HTMLInputElement;
    if (input) input.value = value;
  }
}
