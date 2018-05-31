import { Injectable } from '@angular/core';
import { Config } from './app.config';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';


export class Kid{
	id: number;
	name: string;
	age: number;
	monthly: number;
	parent_id: number;

	constructor(kid = {}) {
		for (let prop in kid) {
			if (kid.hasOwnProperty(prop)) {
				this[prop] = kid[prop];
			}
		}
	}

}

@Injectable()
export class KidService {
	
	private searchTerm: string;
	constructor(
		private _config: Config,
		private _http: Http
	) { }

	getKids(page: number = 1, term: string = null, all: boolean = false){
		let url = this._config.get('apiUrl') + '/kids';
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

	getKid(id: number){
		let url = this._config.get('apiUrl') + '/kids';
		url += '/' + id;
		return this._http.get(url).map( this.extractData );
	}

	createKid(data: any){
		let url = this._config.get('apiUrl') + '/kids';
		return this._http.post(url, data).map( this.extractData );
	}

	updateKid(id: number, data: any){
		let url = this._config.get('apiUrl') + '/kids';
		url += '/' + id;
		return this._http.put(url, data).map( this.extractData );
	}

	deleteKid(id: number){
		let url = this._config.get('apiUrl') + '/kids';
		url += '/' + id;
		return this._http.delete(url).map( this.extractData );
	}

	private extractAllData(res: Response){
		let body = res.json();
		let length = body.data && body.data.length || body.length;
		let data = body.data || body;
		if( length ){
			for(let i=0; i < length; i++){
				data[i] = new Kid( data[i] );
			}
		}
		return body || {};
	}

	private extractData(res: Response){
		let body = res.json();
		if( body ){
			body = new Kid(body);
		}
		return body || {};
	}

	public extractAllError(errors: any){
		return Object.keys(errors);
	}

	renderPagination(data: any, range: number = 3) {
		let pagination = [];
		if (data.next_page_url || data.prev_page_url) {
			for (let i = data.current_page - range; i <= data.last_page; i++) {
				if (i > 0) {
					let obj: any = {
						page: i,
						active: i === data.current_page
					};

					if (this.searchTerm) {
						obj.term = this.searchTerm;
					}
					pagination.push(obj);
				}

				if (i == (data.current_page + range)) {
					break;
				}
			}
		}
		return pagination;
	}

}