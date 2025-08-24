import { IProduct } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export class Card extends Component<IProduct> {
	protected events: IEvents;

	private _id: string;
	private titleElement: HTMLElement;
	private descriptionElement?: HTMLElement;
	private imageElement?: HTMLImageElement;
	private categoryElement?: HTMLElement;
	private priceElement: HTMLElement;
	private addButton?: HTMLButtonElement;
	private removeButton?: HTMLButtonElement;
	private indexElement?: HTMLElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.titleElement = ensureElement('.card__title', container);
		this.descriptionElement = container.querySelector('.card__text');
		this.imageElement = container.querySelector('.card__image');
		this.categoryElement = container.querySelector('.card__category');
		this.priceElement = ensureElement('.card__price', container);
		this.addButton = container.querySelector('.button');
		this.removeButton = container.querySelector('.basket__item-delete');
		this.indexElement = container.querySelector('.basket__item-index');

		this.initListeners();
	}

	private initListeners() {
		this.imageElement?.addEventListener('click', () => {
			this.events.emit('card:select', { card: this });
		});

		this.container.addEventListener('click', (e) => {
			if (e.target === this.container) {
				this.events.emit('card:select', { card: this });
			}
		});

		this.addButton?.addEventListener('click', () => {
			this.events.emit('card:add', { card: this });
		});

		this.removeButton?.addEventListener('click', () => {
			this.events.emit('card:delete', { card: this });
		});
	}

	render(data?: Partial<IProduct>) {
		if (data) {
			Object.assign(this, data);
		}
		return super.render(data);
	}

	updateAddButtonState(isInBasket: boolean) {
		if (this.addButton) {
			this.addButton.disabled = isInBasket;
			console.log(`Кнопка ${isInBasket ? 'заблокирована' : 'разблокирована'}`);
		}
	}

	set index(value: number) {
		if (this.indexElement) {
			this.setText(this.indexElement, value);
		}
	}

	set id(value: string) {
		this._id = value;
	}

	get id(): string {
		return this._id;
	}

	set title(text: string) {
		this.setText(this.titleElement, text);
	}

	set description(text: string) {
		if (this.descriptionElement) {
			this.setText(this.descriptionElement, text);
		}

	}

	set image(url: string) {
		if (this.imageElement) {
			this.setImage(this.imageElement, url, this.title);
		}
	}

	set category(type: string) {
		if (this.categoryElement) {
			const allClasses = [
				'card__category_other',
				'card__category_soft',
				'card__category_hard',
				'card__category_additional',
				'card__category_button',
			];

			this.categoryElement.classList.remove(...allClasses);
			this.categoryElement.textContent = type;

			const categoryClassMap: Record<string, string> = {
				'другое': 'card__category_other',
				'дополнительное': 'card__category_additional',
				'софт-скил': 'card__category_soft',
				'хард-скил': 'card__category_hard',
				'кнопка': 'card__category_button',
			};

			const className = categoryClassMap[type];
			if (className) {
				this.categoryElement.classList.add(className);
			}
		}
	}

	set price(value: number | null) {
		if (this.priceElement) {
			if (value === null) {
				this.setText(this.priceElement, 'Бесценно');
				if (this.addButton) {
					this.addButton.disabled = true;
				}
			} else {
				this.setText(this.priceElement, `${value} синапсов`);
			}
		}
	}


	deleteCard() {
		this.container.remove();
		this.container = null;
	}
}
