import { Injectable } from '@angular/core';

@Injectable()
export class Config {
	private configs: any = {
		'apiUrl' : 'http://localhost:8080/angular/nhatre/public/api'
	};
	constructor() { }

	get(name: string) {
		return this.configs[name];
	}

	set(name: string, value: any) {
		this.configs[name] = value;
	}

}
