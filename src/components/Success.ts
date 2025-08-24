import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";

interface SuccessData {
    total: number;
}

interface SuccessHandlers {
    onClose?: () => void;
}

export class Success extends Component<SuccessData> {
    private closeButton: HTMLElement;
    private totalInfo: HTMLElement;

    constructor(element: HTMLElement, handlers: SuccessHandlers) {
        super(element);

        this.closeButton = ensureElement('.order-success__close', this.container);
        this.totalInfo = ensureElement('.order-success__description', this.container);

        this.bindEvents(handlers);
    }

    private bindEvents(handlers: SuccessHandlers): void {
        if (handlers.onClose) {
            this.closeButton.addEventListener('click', handlers.onClose);
        }
    }

    set total(value: number) {
        this.setText(this.totalInfo, `Списано ${value} синапсов`);
    }
}
