import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ToolService } from '../tool.service';
import { Kid, KidService } from '../kid.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
declare let jQuery;


@Component({
	selector: 'app-kid-list',
	templateUrl: './kid-list.component.html',
	styleUrls: ['./kid-list.component.css']
})

export class KidListComponent implements OnInit {
	kids: Kid[] = [];
	kid: Kid = new Kid();
	data: any;
	pagination: any = [];
	message: string;
	error: string;
	currentPage: number;
	loading: boolean = false;
	

	// Tìm kiếm

	private timeoutId: any;
	private newTerm: string;
	private oldTerm: string;



	@ViewChild('search') searchElement: ElementRef;
	@ViewChild('deleteModal') deleteModalElement: ElementRef;

	// Giải phóng bộ nhớ
	private subscription;

	constructor(
		private _toolService: ToolService,
		private _kidService: KidService,
		private _route: ActivatedRoute,
		private _router: Router
	) { }

	ngOnInit() {
		this.refreshList();
	}

	ngOnDestroy(){
		this.subscription != null ? this.subscription.unsubscribe() : null;
	}

	onShowModal(kid: Kid){
		this.kid = kid;
		jQuery(this.deleteModalElement.nativeElement).modal('show');
	}

	onDelete(){
		this.message = null;
		this.error = null;
		this.subscription != null ? this.subscription.unsubscribe() : null;
		this.subscription = this._kidService.deleteKid(this.kid.id).subscribe(res=>{
			if(res.message){
				this.message = res.message;
				this.kids.splice(this.kids.indexOf(this.kid),1);
				this.refreshList();
			}
			if(res.error){
				this.error = res.error;
			}
		});
		jQuery(this.deleteModalElement.nativeElement).modal('hide');
	}

	trackByKids(index: number, kid: Kid){
		return kid.id;
	}

	onSearch(){
		clearTimeout(this.timeoutId);
		this.timeoutId = setTimeout(()=>{
			this.refreshList();
		},200);
	}

	refreshList(){
		this.error = this._toolService.flashMessage || null;
		this.subscription != null ? this.subscription.unsubscribe() : null;
		this.subscription = this._route.queryParamMap.switchMap((params: ParamMap)=>{
			this.loading = true;
			this.currentPage = +params.get('page') > 0 ? +params.get('page') : 1;
			this.newTerm = this.searchElement.nativeElement.value || '';
			if(this.newTerm != this.oldTerm){
				this.currentPage = 1;
			}
			return this._kidService.getKids(this.currentPage,this.newTerm);
		}).subscribe(res =>{
			this.loading = false;
			this.oldTerm = this.newTerm;
			this.kids = res.data;
			this.data = res;
			this.pagination = this._kidService.renderPagination(this.data);

		});
	}

	refreshListManually(){
		this.loading = true;
		let subscription = this._kidService.getKids(this.currentPage || 1,this.newTerm)
		.subscribe(res =>{
			this.loading = false;
			this.kids = res.data;
			this.data = res;
			this.pagination = this._kidService.renderPagination(this.data);
			subscription.unsubscribe();
		});
	}

}
