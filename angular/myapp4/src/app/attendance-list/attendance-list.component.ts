import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ToolService } from '../tool.service';
import { Kid, KidService } from '../kid.service';
import { Attendance, AttendanceService } from '../attendance.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
declare let jQuery;


@Component({
	selector: 'app-attendance-list',
	templateUrl: './attendance-list.component.html',
	styleUrls: ['./attendance-list.component.css']
})

export class AttendanceListComponent implements OnInit {
	kids: Kid[] = [];
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

	// Giải phóng bộ nhớ
	private subscription;

	constructor(
		private _toolService: ToolService,
		private _kidService: KidService,
		private _attendanceService: AttendanceService,
		private _route: ActivatedRoute,
		private _router: Router
	) { }

	ngOnInit() {
		this.refreshList();
	}

	ngOnDestroy(){
		this.subscription != null ? this.subscription.unsubscribe() : null;
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
			return this._attendanceService.getKids(this.currentPage,this.newTerm);
		}).subscribe(res =>{
			this.loading = false;
			this.oldTerm = this.newTerm;
			this.kids = res.data;
			this.data = res;
			this.pagination = this._attendanceService.renderPagination(this.data);

		});
	}

	refreshListManually(){
		this.loading = true;
		let subscription = this._attendanceService.getKids(this.currentPage || 1,this.newTerm)
		.subscribe(res =>{
			this.loading = false;
			this.kids = res.data;
			this.data = res;
			this.pagination = this._attendanceService.renderPagination(this.data);
			subscription.unsubscribe();
		});
	}

}