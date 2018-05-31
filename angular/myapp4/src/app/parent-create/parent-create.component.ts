import { Component, OnInit } from '@angular/core';
import { ToolService } from '../tool.service';
import { Parent, ParentService } from '../parent.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
declare let jQuery;

@Component({
	selector: 'app-parent-create',
	templateUrl: './parent-create.component.html',
	styleUrls: ['./parent-create.component.css']
})
export class ParentCreateComponent implements OnInit {

	parent: Parent = new Parent();
	errors: any;
	errorKeys: any;
	loading: boolean = false;
	private subscription;

	constructor(
		private _toolService: ToolService,
		private _parentService: ParentService,
		private _route: ActivatedRoute,
		private _router: Router
	) { }

	ngOnInit() {
	}

	ngOnDestroy(){
		this.subscription != null ? this.subscription.unsubscribe() : null;
	}

	onCreate(){
		this.loading = true;
		this.errors = null;
		this.subscription != null ? this.subscription.unsubscribe() : null;
		this.subscription = this._parentService.createParent(this.parent).subscribe(res=>{
			this.loading = false;
			if(res.message){
				this._toolService.flashMessage = res.message;
				this.parent = res.parent;
				this._router.navigate(['/parents/' + this.parent.id]);
			}
			if(res.errors){
				this.errors = res.errors;
				this.errorKeys = this._parentService.extractAllError(this.errors);
				jQuery('html, body').animate({ scrollTop: 0 }, 'slow');
			}
		});
	}

}
