import './scss/styles.scss';
import { AppApi } from './components/AppApi';
import { Api } from "./components/base/api";
import { EventEmitter } from "./components/base/events";
import { BasketData } from "./components/BasketData";
import { ProductsData } from "./components/ProductsData";
import { IApi, IDataContacts, IProduct } from "./types";
import { API_URL, CDN_URL} from "./utils/constants";
import { Card } from './components/Card';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { CardsContainer } from './components/CardsContainer';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { Page } from './components/Page';
import { IDataPayment, DataPayment } from './components/DataPayment';
import { DataContacts } from './components/DataContacts';
import { AppState } from './components/AppState';
import { Success } from './components/Success';

const dispatcher = new EventEmitter();

const httpBase: IApi = new Api(API_URL);
const appApi = new AppApi(httpBase, CDN_URL);

dispatcher.onAll(event => {
    console.log(`[EVENT]: ${event.eventName}`, event.data);
});

const templates = {
    cardMain: ensureElement<HTMLTemplateElement>('#card-catalog'),
    cardPreview: ensureElement<HTMLTemplateElement>('#card-preview'),
    cardBasket: ensureElement<HTMLTemplateElement>('#card-basket'),
    basket: ensureElement<HTMLTemplateElement>('#basket'),
    paymentForm: ensureElement<HTMLTemplateElement>('#order'),
    contactForm: ensureElement<HTMLTemplateElement>('#contacts'),
    success: ensureElement<HTMLTemplateElement>('#success')
};

const page = new Page(document.body, dispatcher);
const gallery = new CardsContainer(ensureElement<HTMLTemplateElement>('.gallery'));
const products = new ProductsData(dispatcher);
const modal = new Modal(ensureElement('#modal-container'), dispatcher);
const cart = new Basket(cloneTemplate(templates.basket), dispatcher);
const cartState = new BasketData(dispatcher);
const paymentForm = new DataPayment(cloneTemplate(templates.paymentForm), dispatcher);
const contactForm = new DataContacts(cloneTemplate(templates.contactForm), dispatcher);
const appState = new AppState({}, dispatcher);
const successScreen = new Success(cloneTemplate(templates.success), {
    onClose: () => {
        modal.hide();
        appState.resetOrder();

    }
});


appApi.getCards()
    .then(data => {
        products.items = data;
    })
    .catch(error => {
        console.error("Ошибка при получении товаров:", error);
    });

dispatcher.on("catalog:changed", () => {
    const renderedCards = products.items.map(item => {
        const card = new Card(cloneTemplate(templates.cardMain), dispatcher);
        return card.render(item);
    });

    gallery.render({ catalog: renderedCards });
});

dispatcher.on("card:select", ({ card }: { card: Card }) => {
    const productInfo = products.getProduct(card.id);
    const cardView = new Card(cloneTemplate(templates.cardPreview), dispatcher);

    const alreadyInCart = cartState.items.some(item => item.id === card.id);

    cardView.updateAddButtonState(alreadyInCart);

    modal.render({
        content: cardView.render(productInfo)
    });
});

dispatcher.on("card:add", ({ card }: { card: Card }) => {
    const productData = products.getProduct(card.id);
    cartState.addProduct(productData);
    modal.hide();
});

dispatcher.on("card:delete", ({ card }: { card: Card }) => {
    cartState.removeProduct(card.id);
});

//+

dispatcher.on("basket:open", () => {
    modal.render({
        content: createElement('div', {}, [cart.render()])
    });
});

dispatcher.on("basket:changed", ({ items }: { items: IProduct[] }) => {
    cart.items = items.map((product, i) => {
        const card = new Card(cloneTemplate(templates.cardBasket), dispatcher);
        card.index = i + 1;
        return card.render(product);
    });
    cart.total = cartState.getTotal();
    page.counter = items.length;


    modal.render({ content: cart.render() });
});

dispatcher.on("modal:open", () => page.locked = true);
dispatcher.on("modal:close", () => page.locked = false);


dispatcher.on("formPayment:open", () => {
    const filled = !!appState.order.payment && !!appState.order.address;

    modal.render({
        content: paymentForm.render({
            payment: appState.order.payment,
            address: appState.order.address,
            valid: filled,
            errors: []

        })
    });
});

dispatcher.on("formPaymentErrors:change", (errors: Partial<IDataPayment>) => {
    const { payment, address } = errors;
    paymentForm.valid = !payment && !address;
    paymentForm.errors = Object.values({ payment, address }).filter(Boolean).join("; ");
});

dispatcher.on(/^order\..*:change/, ({ field, value }: { field: keyof IDataPayment, value: string }) => {
    appState.updatePaymentData(field, value);
});

dispatcher.on("order:submit", () => {
    const valid = !!appState.order.email && !!appState.order.phone;

    modal.render({
        content: contactForm.render({
            email: appState.order.email,
            phone: appState.order.phone,
            valid,
            errors: []
        })
    });
});

dispatcher.on("formContactsErrors:change", (errors: Partial<IDataContacts>) => {

    const { email, phone } = errors;
    contactForm.valid = !email && !phone;
    contactForm.errors = Object.values({ email, phone }).filter(Boolean).join("; ");
});

dispatcher.on(/^contacts\..*:change/, ({ field, value }: { field: keyof IDataContacts, value: string }) => {
    appState.updateContactData(field, value);
});

dispatcher.on("contacts:submit", () => {
    const payload = {
        ...appState.order,
        items: cartState.items.map(item => item.id),
        total: cartState.getTotal()
    };

    appApi.postOrder(payload)
        .then(result => {
            cartState.reset();
            appState.resetOrder();
            successScreen.total = result.total;
            modal.render({
                content: successScreen.render({})
            });
        })
        .catch(err => console.error(err));
});
