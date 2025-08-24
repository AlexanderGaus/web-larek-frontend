import { Component } from './base/Component';
import { ensureElement, createElement } from '../utils/utils';
import { EventEmitter } from './base/events';

interface IBasketView {
	items: HTMLElement[];
	total: number;
	selected: string[];
}

export class Basket extends Component<IBasketView> {
	private item: HTMLElement;
	private totalDisplay: HTMLElement;
	private checkButton: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this.item = ensureElement<HTMLElement>('.basket__list', container);
		this.totalDisplay = ensureElement<HTMLElement>('.basket__price', container);
		this.checkButton = ensureElement<HTMLButtonElement>('.basket__button', container);

		this.setupEventListeners();

		this.items = [];
	}

	private setupEventListeners() {
		this.checkButton.addEventListener('click', () => {
			this.events.emit('formPayment:open');
		});
	}

	set items(elements: HTMLElement[]) {
		if (elements.length === 0) {
			const emptyMessage = createElement<HTMLParagraphElement>('p', {
				textContent: 'Корзина пуста',
			});
			this.item.replaceChildren(emptyMessage);
			this.checkButton.disabled = true;
		} else {
			this.item.replaceChildren(...elements);
			this.checkButton.disabled = false;
		}
	}

	set total(amount: number) {
		this.setText(this.totalDisplay, `${amount} синапсов`);
	}
}
