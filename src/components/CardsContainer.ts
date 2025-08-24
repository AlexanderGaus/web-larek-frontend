import { Component } from './base/Component';

interface ICardsContainer {
    catalog: HTMLElement[];
}

export class CardsContainer extends Component<ICardsContainer> {
    private catalogContainer: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.catalogContainer = container;
    }

    set catalog(elements: HTMLElement[]) {
        
        this.catalogContainer.innerHTML = '';
        elements.forEach(element => this.catalogContainer.appendChild(element));
    }
}
