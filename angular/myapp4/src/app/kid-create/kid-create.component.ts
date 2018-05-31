import { Component, OnInit } from '@angular/core';
import { ToolService } from '../tool.service';
import { Kid, KidService } from '../kid.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
declare let jQuery;

@Component({
	selector: 'app-kid-create',
	templateUrl: './kid-create.component.html',
	styleUrls: ['./kid-create.component.css']
})
export class KidCreateComponent implements OnInit {

	kid: Kid = new Kid();
	errors: any;
	errorKeys: any;
	loading: boolean = false;
	private subscription;

	constructor(
		private _toolService: ToolService,
		private _kidService: KidService,
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
		this.subscription = this._kidService.createKid(this.kid).subscribe(res=>{
			this.loading = false;
			if(res.message){
				this._toolService.flashMessage = res.message;
				this.kid = res.kid;
				this._router.navigate(['/kids/' + this.kid.id]);
			}
			if(res.errors){
				this.errors = res.errors;
				this.errorKeys = this._kidService.extractAllError(this.errors);
				jQuery('html, body').animate({ scrollTop: 0 }, 'slow');
			}
		});
	}

}