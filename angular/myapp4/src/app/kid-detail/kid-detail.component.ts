import { Component, OnInit } from '@angular/core';
import { ToolService } from '../tool.service';
import { Parent, ParentService } from '../parent.service';
import { Kid, KidService } from '../kid.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
declare let jQuery;

@Component({
	selector: 'app-kid-detail',
	templateUrl: './kid-detail.component.html',
	styleUrls: ['./kid-detail.component.css']
})
export class KidDetailComponent implements OnInit {
	parents: Parent[] = [];
	kid: Kid = new Kid();
	errors: any;
	errorKeys: any;
	message: string;
	loading: boolean = false;
	private subscription;

	constructor(
		private _toolService: ToolService,
		private _parentService: ParentService,
		private _kidService: KidService,
		private _route: ActivatedRoute,
		private _router: Router
	) { }

	ngOnInit() {
		this.message = this._toolService.flashMessage || null;
		this.getParents();
		this.getKid();
	}

	ngOnDestroy(){
		this.subscription != null ? this.subscription.unsubscribe() : null;
	}

	getParents(){
		let subscription = this._parentService.getParents(0,null,true)
		.subscribe(res =>{
			this.parents = res;
			subscription.unsubscribe();
		});
	}

	getKid(){
		this.subscription != null ? this.subscription.unsubscribe() : null;
		this.subscription = this._route.paramMap.switchMap((params: ParamMap)=>{
			this.loading = true;
			return this._kidService.getKid(+params.get('id'));
		}).subscribe(res =>{
			this.loading = false;
			if(!res.error){
				this.kid = res;
			}else{
				this._toolService.flashMessage = res.error;
				this._router.navigate(['/kids']);
			}
		});
	}

	onUpdate(){
		this.errors = null;
		this.message = null;
		this.subscription != null ? this.subscription.unsubscribe() : null;
		this.subscription = this._route.paramMap.switchMap((params: ParamMap)=>{
			this.loading = true;
			return this._kidService.updateKid(+params.get('id'), this.kid);
		}).subscribe(res=>{
			this.loading = false;
			if(res.message){
				this.message = res.message;
				this.kid = res.kid;
			}
			if(res.errors){
				this.errors = res.errors;
				this.errorKeys = this._kidService.extractAllError(this.errors);
				jQuery('html, body').animate({ scrollTop: 0 }, 'slow');
			}
		});
	}

}