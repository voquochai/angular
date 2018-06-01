import { Injectable } from '@angular/core';
import { Config } from './app.config';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';

export class Attendance{
	id: number;
	type: string;
	start: number;
	end: number;
	overtime: number;
	kid_id: number;
	date: string;

	constructor(attendance = {}) {
		for (let prop in attendance) {
			if (attendance.hasOwnProperty(prop)) {
				this[prop] = attendance[prop];
			}
		}
	}
}

@Injectable()
export class AttendanceService {
	
	private searchTerm: string;
	constructor(
		private _config: Config,
		private _http: Http
	) { }

	getKids(page: number = 1, term: string = null, date: string = null){
		let url = this._config.get('apiUrl') + '/attendances/all-kids';
		url += '?page=' + page;
		this.searchTerm = term;
		if(term){
			url += '&search='+term;
		}
		if(date){
			url += '&date=' + date;
		}

		return this._http.get(url).map( this.extractAllData );
	}

	start(data: any){
		let url = this._config.get('apiUrl') + '/attendances/start';
		return this._http.post(url, data).map( this.extractAllData );
	}

	end(data: any){
		let url = this._config.get('apiUrl') + '/attendances/end';
		return this._http.post(url, data).map( this.extractAllData );
	}

	off(data: any){
		let url = this._config.get('apiUrl') + '/attendances/off';
		return this._http.post(url, data).map( this.extractAllData );
	}

	private extractAllData(res: Response){
		let body = res.json();
		let length = body.data && body.data.length || body.length;
		let data = body.data || body;
		if( length ){
			for(let i=0; i < length; i++){
				data[i] = new Attendance( data[i] );
			}
		}
		return body || {};
	}

	private extractData(res: Response){
		let body = res.json();
		if( body ){
			body = new Attendance(body);
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
