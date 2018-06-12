import { Component, OnInit } from '@angular/core';
import { ToolService } from '../tool.service';
import { Product, ProductService } from '../product.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
declare let jQuery;

@Component({
	selector: 'app-product-create',
	templateUrl: './product-create.component.html',
	styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {
	
	product: Product = new Product();
	errors: any;
	errorKeys: any;
	loading: boolean = false;
	private subscription;

	constructor(
		private _toolService: ToolService,
		private _productService: ProductService,
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
		this.subscription = this._productService.createProduct(this.product).subscribe(res=>{
			this.loading = false;
			if(res.message){
				this._toolService.flashMessage = res.message;
				this.product = res.product;
				this._router.navigate(['/products/' + this.product.id]);
			}
			if(res.errors){
				this.errors = res.errors;
				this.errorKeys = this._toolService.extractAllError(this.errors);
				jQuery('html, body').animate({ scrollTop: 0 }, 'slow');
			}
		});
	}

}
