import { Component } from "./base/Component";
import { IEvents } from "./base/events";
import { ensureElement } from "../utils/utils";

interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export class Page extends Component<IPage> {
    private counterElement: HTMLElement;
    private contentWrapper: HTMLElement;
    private basketButton: HTMLElement;

    constructor(container: HTMLElement, public events: IEvents) {
        super(container);

        this.counterElement = ensureElement('.header__basket-counter');
        this.contentWrapper = ensureElement('.page__wrapper');
        this.basketButton = ensureElement('.header__basket');

        this.initializeBasketHandler();
    }

    private initializeBasketHandler(): void {
        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this.setText(this.counterElement, String(value));
    }

    set locked(isLocked: boolean) {
        this.contentWrapper.classList.toggle('page__wrapper_locked', isLocked);
    }
}
