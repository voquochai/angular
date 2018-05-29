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
	currentPage: number;

	// Tìm kiếm

	private timeoutId: any;
	private newTerm: string;
	private oldTerm: string;

	@ViewChild('search') searchElement: ElementRef;
	@ViewChild('deleteModal') deleteModalElement: ElementRef;

	// Giải phóng bộ nhớ
	private subscription;
	private subscriptionManually;

	constructor(
		private _parentService: ParentService,
		private _route: ActivatedRoute,
		private _router: Router
	) { }

	ngOnInit() {
		this.refreshList();
	}

	ngOnDestroy(){
		this.subscription != null ? this.subscription.unsubscribe() : null;
	}

	onShowModal(parent: Parent){
		this.parent = parent;
		jQuery(this.deleteModalElement.nativeElement).modal('show');
	}

	onDelete(){
		this.message = null;
		this.error = null;
		this.subscription != null ? this.subscription.unsubscribe() : null;
		this.subscription = this._parentService.deleteParent(this.parent.id).subscribe(res=>{
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

	onSearch(){
		clearTimeout(this.timeoutId);
		this.timeoutId = setTimeout(()=>{
			this.refreshList();
		},200);
	}

	refreshList(){
		this.subscription != null ? this.subscription.unsubscribe() : null;
		this.subscription = this._route.queryParamMap.switchMap((params: ParamMap)=>{
			this.currentPage = +params.get('page') > 0 ? +params.get('page') : 1;
			this.newTerm = this.searchElement.nativeElement.value || '';
			if(this.newTerm != this.oldTerm){
				this.currentPage = 1;
			}
			return this._parentService.getParents(this.currentPage,this.newTerm);
		}).subscribe(res =>{
			this.oldTerm = this.newTerm;
			this.parents = res.data;
			this.data = res;
			this.pagination = this._parentService.renderPagination(this.data);
		});
	}

	refreshListManually(){
		this.subscriptionManually != null ? this.subscriptionManually.unsubscribe() : null;
		this.subscriptionManually = this._parentService.getParents(this.currentPage || 1,this.newTerm)
		.subscribe(res =>{
			this.parents = res.data;
			this.data = res;
			this.pagination = this._parentService.renderPagination(this.data);
		});
	}

}
