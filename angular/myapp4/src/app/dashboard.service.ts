import { Injectable } from '@angular/core';
import { Config } from './app.config';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';

export class Stats{
	parents: number;
	kids: any;
	sumMonthly: number;
	sumAllRevenues: number;
	realIncome: number;
	totalDaysOff: number;

	constructor(stats = {}) {
		for (let prop in stats) {
			if (stats.hasOwnProperty(prop)) {
				this[prop] = stats[prop];
			}
		}
	}

}

@Injectable()
export class DashboardService {

	constructor(
		private _config: Config,
		private _http: Http
	) { }

	getStats(){
		let url = this._config.get('apiUrl') + '/dashboard';
		return this._http.get(url).map( this.extractData );
	}

	private extractData(res: Response){
		let body = res.json();
		if( body ){
			body = new Stats(body);
		}
		return body || {};
	}

}
