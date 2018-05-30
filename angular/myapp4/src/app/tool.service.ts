import { Injectable } from '@angular/core';

@Injectable()
export class ToolService {
	private _message: string;
	constructor() { }

	get flashMessage(){
		let message = this._message;
		this._message = null;
		return message;
	}
	set flashMessage(message: string){
		this._message = message;
	}
}
