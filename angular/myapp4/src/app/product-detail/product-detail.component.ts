import { Component, OnInit } from '@angular/core';
import { ToolService } from '../tool.service';
import { Product, ProductService } from '../product.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
declare let jQuery;

@Component({
	selector: 'app-product-detail',
	templateUrl: './product-detail.component.html',
	styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

	product: Product = new Product();
	errors: any;
	errorKeys: any;
	message: string;
	loading: boolean = false;
	private subscription;

	constructor(
		private _toolService: ToolService,
		private _productService: ProductService,
		private _route: ActivatedRoute,
		private _router: Router
	) { }

	ngOnInit() {
		this.message = this._toolService.flashMessage || null;
		this.getProduct();
	}

	ngOnDestroy(){
		this.subscription != null ? this.subscription.unsubscribe() : null;
	}

	getProduct(){
		this.subscription != null ? this.subscription.unsubscribe() : null;
		this.subscription = this._route.paramMap.switchMap((params: ParamMap)=>{
			this.loading = true;
			return this._productService.getProduct(+params.get('id'));
		}).subscribe(res =>{
			this.loading = false;
			if(!res.error){
				this.product = res;
			}else{
				this._toolService.flashMessage = res.error;
				this._router.navigate(['/products']);
			}
		});
	}

	onUpdate(){
		this.errors = null;
		this.message = null;
		this.subscription != null ? this.subscription.unsubscribe() : null;
		this.subscription = this._route.paramMap.switchMap((params: ParamMap)=>{
			this.loading = true;
			return this._productService.updateProduct(+params.get('id'), this.product);
		}).subscribe(res=>{
			this.loading = false;
			if(res.message){
				this.message = res.message;
				this.product = res.product;
			}
			if(res.errors){
				this.errors = res.errors;
				this.errorKeys = this._toolService.extractAllError(this.errors);
				jQuery('html, body').animate({ scrollTop: 0 }, 'slow');
			}
		});
	}

}
