import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Parent, ParentService } from '../parent.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
declare let jQuery;


@Component({
	selector: 'app-parent-list',
	templateUrl: './parent-list.component.html',
	styleUrls: ['./parent-list.component.css']
})

export class ParentListComponent implements OnInit {
	parents: Parent[] = [];
	parent: Parent = new Parent();
	data: any;
	pagination: any = [];
	message: string;
	error: string;

	constructor(
		private _parentService: ParentService,
		private _route: ActivatedRoute,
		private _router: Router
	) { }

	ngOnInit() {
		this.refreshList();
	}

	refreshList(){
		this._route.queryParamMap.switchMap((params: ParamMap)=>{
			let page = +params.get('page') > 0 ? +params.get('page') : 1;
			return this._parentService.getParents(page);
		}).subscribe(res =>{
			this.parents = res.data;
			this.data = res;
			this.pagination = this._parentService.renderPagination(this.data);
		});
	}

}
