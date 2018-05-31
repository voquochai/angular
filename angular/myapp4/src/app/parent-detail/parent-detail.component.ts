import { Component, OnInit } from '@angular/core';
import { ToolService } from '../tool.service';
import { Parent, ParentService } from '../parent.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
declare let jQuery;

@Component({
	selector: 'app-parent-detail',
	templateUrl: './parent-detail.component.html',
	styleUrls: ['./parent-detail.component.css']
})
export class ParentDetailComponent implements OnInit {

	parent: Parent = new Parent();
	errors: any;
	errorKeys: any;
	message: string;
	loading: boolean = false;
	private subscription;

	constructor(
		private _toolService: ToolService,
		private _parentService: ParentService,
		private _route: ActivatedRoute,
		private _router: Router
	) { }

	ngOnInit() {
		this.message = this._toolService.flashMessage || null;
		this.getParent();
	}

	ngOnDestroy(){
		this.subscription != null ? this.subscription.unsubscribe() : null;
	}

	getParent(){
		this.subscription != null ? this.subscription.unsubscribe() : null;
		this.subscription = this._route.paramMap.switchMap((params: ParamMap)=>{
			this.loading = true;
			return this._parentService.getParent(+params.get('id'));
		}).subscribe(res =>{
			this.loading = false;
			if(!res.error){
				this.parent = res;
			}else{
				this._toolService.flashMessage = res.error;
				this._router.navigate(['/parents']);
			}
		});
	}

	onUpdate(){
		this.errors = null;
		this.message = null;
		this.subscription != null ? this.subscription.unsubscribe() : null;
		this.subscription = this._route.paramMap.switchMap((params: ParamMap)=>{
			this.loading = true;
			return this._parentService.updateParent(+params.get('id'), this.parent);
		}).subscribe(res=>{
			this.loading = false;
			if(res.message){
				this.message = res.message;
				this.parent = res.parent;
			}
			if(res.errors){
				this.errors = res.errors;
				this.errorKeys = this._parentService.extractAllError(this.errors);
				jQuery('html, body').animate({ scrollTop: 0 }, 'slow');
			}
		});
	}

}
