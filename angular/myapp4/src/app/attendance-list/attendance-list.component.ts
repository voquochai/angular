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
	private dateTerm: string;

	@ViewChild('search') searchElement: ElementRef;
	@ViewChild('searchByDate') searchByDateElement: ElementRef;

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
		this.dataPickerInit();
		this.refreshList();
	}

	dataPickerInit(){
		jQuery(this.searchByDateElement.nativeElement).off('changeDate');
		jQuery(this.searchByDateElement.nativeElement).datepicker({
			format: "yyyy-mm-dd",
			autoclose: true
		}).on('changeDate', ()=>{
			this.refreshList();
		});
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

	onStart(kid: Kid){
		let data: any = {
			kid_id : kid.id
		}
		this.loading = true;
		this.message = null;
		this.error = null;
		let subscription = this._attendanceService.start(data).subscribe(res => {
			this.loading = false;
			if(res.message !=''){
				this.message = res.message;
				this.refreshList();
			}
			if(res.error !=''){
				this.error = res.error;
			}
			subscription.unsubscribe();
		});
	}

	onEnd(kid: Kid){
		let data: any = {
			kid_id : kid.id
		}
		this.loading = true;
		this.message = null;
		this.error = null;
		let subscription = this._attendanceService.end(data).subscribe(res => {
			this.loading = false;
			if(res.message !=''){
				this.message = res.message;
				this.refreshList();
			}
			if(res.error !=''){
				this.error = res.error;
			}
			subscription.unsubscribe();
		});
	}

	onOff(kid: Kid){
		let data: any = {
			kid_id : kid.id
		}
		this.loading = true;
		this.message = null;
		this.error = null;
		let subscription = this._attendanceService.off(data).subscribe(res => {
			this.loading = false;
			if(res.message !=''){
				this.message = res.message;
				this.refreshList();
			}
			if(res.error !=''){
				this.error = res.error;
			}
			subscription.unsubscribe();
		});
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
			this.dateTerm = this.searchByDateElement.nativeElement.value || '';
			return this._attendanceService.getKids(this.currentPage,this.newTerm,this.dateTerm);
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