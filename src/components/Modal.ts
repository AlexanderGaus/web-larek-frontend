import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { Component } from "./base/Component";

interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    private closeBtn: HTMLButtonElement;
    private contentArea: HTMLElement;

    constructor(container: HTMLElement, private events: IEvents) {
        super(container);

        this.closeBtn = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.contentArea = ensureElement<HTMLElement>('.modal__content', container);

        this.registerEvents();
    }

    private registerEvents(): void {
        this.closeBtn.addEventListener('click', this.handleClose);
        this.container.addEventListener('click', this.handleClose);
        this.contentArea.addEventListener('click', this.stopPropagation);
    }

    private stopPropagation(event: MouseEvent): void {
        event.stopPropagation();
    }


    private handleClose = (): void => {
        this.hide();
    };

    private show(): void {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    hide(): void {
        this.container.classList.remove('modal_active');
        this.clearContent();
        this.events.emit('modal:close');

    }

    private clearContent(): void {
        this.content = null;
    }

    set content(element: HTMLElement | null) {
        this.contentArea.replaceChildren(element || document.createTextNode(''));
    }

    render(data: IModalData): HTMLElement {
        this.content = data.content;
        this.show();
        return this.container;
    }
}
