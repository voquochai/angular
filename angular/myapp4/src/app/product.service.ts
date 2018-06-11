import { Injectable } from '@angular/core';
import { Config } from './app.config';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';

export class Product{
	id: number;
	code: string;
	name: string;
	regular_price: number;
	sale_price: number;
	original_price: number;

	constructor(product = {}) {
		for (let prop in product) {
			if (product.hasOwnProperty(prop)) {
				this[prop] = product[prop];
			}
		}
	}

}

@Injectable()
export class ProductService {
	
	private searchTerm: string;

	constructor(
		private _config: Config,
		private _http: Http
	) { }

	getProducts(page: number = 1, term: string = null, all: boolean = false){
		let url = this._config.get('apiUrl') + '/products';
		url += '?page=' + page;
		this.searchTerm = term;
		if(term){
			url += '&search='+term;
		}
		if(all){
			url += '&all=true';
		}

		return this._http.get(url).map( this.extractAllData );
	}

	getProduct(id: number){
		let url = this._config.get('apiUrl') + '/products';
		url += '/' + id;
		return this._http.get(url).map( this.extractData );
	}

	createProduct(data: any){
		let url = this._config.get('apiUrl') + '/products';
		return this._http.post(url, data).map( this.extractData );
	}

	updateProduct(id: number, data: any){
		let url = this._config.get('apiUrl') + '/products';
		url += '/' + id;
		return this._http.put(url, data).map( this.extractData );
	}

	deleteProduct(id: number){
		let url = this._config.get('apiUrl') + '/products';
		url += '/' + id;
		return this._http.delete(url).map( this.extractData );
	}

	private extractAllData(res: Response){
		let body = res.json();
		let length = body.data && body.data.length || body.length;
		let data = body.data || body;
		if( length ){
			for(let i=0; i < length; i++){
				data[i] = new Product( data[i] );
			}
		}
		return body || {};
	}

	private extractData(res: Response){
		let body = res.json();
		if( body ){
			body = new Product(body);
		}
		return body || {};
	}

}
