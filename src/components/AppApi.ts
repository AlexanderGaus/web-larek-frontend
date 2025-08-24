import { IApi, IOrder, IOrderResult, IProduct } from '../types';
import { ApiListResponse } from './base/api';

export class AppApi {
	private _baseApi: IApi;
	private _cdn: string;

	constructor(baseApi: IApi,  cdn: string) {
		this._baseApi = baseApi;
		this._cdn = cdn;
	}

	getCards(): Promise<IProduct[]> {
        return this._baseApi.get<ApiListResponse<IProduct>>(`/product`).then((response) =>
            response.items.map((card) => ({
                ...card,
                image: `${this._cdn}${card.image}`,
            }))
        );
    }

	postOrder(orderData: IOrder): Promise<IOrderResult> {
		return this._baseApi.post<IOrderResult>('/order', orderData).then((result: IOrderResult) => result);
	}	
}
