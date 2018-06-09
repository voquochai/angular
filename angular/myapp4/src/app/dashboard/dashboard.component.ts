import { Component, OnInit } from '@angular/core';
import { ToolService } from '../tool.service';
import { Stats, DashboardService } from '../dashboard.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
declare let jQuery;

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
	
	stats: Stats[] = [];
	message: string;
	error: string;
	loading: boolean = false;

	// Giải phóng bộ nhớ
	private subscription;

	constructor(
		private _toolService: ToolService,
		private _dashboardService: DashboardService,
		private _route: ActivatedRoute,
		private _router: Router
	) { }

	ngOnInit() {
		this.getStats();
	}

	getStats(){
		this.subscription != null ? this.subscription.unsubscribe() : null;
		this.subscription = this._route.queryParamMap.switchMap((params: ParamMap)=>{
			this.loading = true;
			return this._dashboardService.getStats();
		}).subscribe(res =>{
			this.loading = false;
			this.stats = res;
		});
	}

}
