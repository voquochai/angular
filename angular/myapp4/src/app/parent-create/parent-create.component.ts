import { Component, OnInit } from '@angular/core';
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
	private subscription;

	constructor(
		private _parentService: ParentService,
		private _route: ActivatedRoute,
		private _router: Router
	) { }

	ngOnInit() {
	}

	onCreate(){
		this.subscription != null ? this.subscription.unsubscribe() : null;
		this.subscription = this._parentService.createParent(this.parent);
	}

}
