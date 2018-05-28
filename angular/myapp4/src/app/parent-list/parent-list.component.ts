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

	@ViewChild('deleteModal') deleteModalElement: ElementRef;

	constructor(
		private _parentService: ParentService,
		private _route: ActivatedRoute,
		private _router: Router
	) { }

	ngOnInit() {
		this.refreshList();
	}

	onShowModal(parent: Parent){
		this.parent = parent;
		jQuery(this.deleteModalElement.nativeElement).modal('show');
	}

	onDelete(){
		this.message = null;
		this.error = null;
		this._parentService.deleteParent(this.parent.id).subscribe(res=>{
			if(res.message){
				this.message = res.message;
				this.parents.splice(this.parents.indexOf(this.parent),1);
				this.refreshList();
			}
			if(res.error){
				this.error = res.error;
			}
		});
		jQuery(this.deleteModalElement.nativeElement).modal('hide');
	}

	trackByParents(index: number, parent: Parent){
		return parent.id;
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
