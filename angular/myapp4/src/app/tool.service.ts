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

	extractAllError(errors: any){
		return Object.keys(errors);
	}

	renderPagination(data: any, searchTerm: any, range: number = 3) {
		let pagination = [];
		if (data.next_page_url || data.prev_page_url) {
			for (let i = data.current_page - range; i <= data.last_page; i++) {
				if (i > 0) {
					let obj: any = {
						page: i,
						active: i === data.current_page
					};

					if (searchTerm) {
						obj.term = searchTerm;
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
