import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ToolService } from '../tool.service';
import { Product, ProductService } from '../product.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
declare let jQuery;

@Component({
	selector: 'app-product-list',
	templateUrl: './product-list.component.html',
	styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

	products: Product[] = [];
	product: Product = new Product();
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
	@ViewChild('deleteModal') deleteModalElement: ElementRef;

	// Giải phóng bộ nhớ
	private subscription;

	constructor(
		private _toolService: ToolService,
		private _productService: ProductService,
		private _route: ActivatedRoute,
		private _router: Router
	) { }

	ngOnInit() {
		this.refreshList();
	}

	ngOnDestroy(){
		this.subscription != null ? this.subscription.unsubscribe() : null;
	}

	onShowModal(product: Product){
		this.product = product;
		jQuery(this.deleteModalElement.nativeElement).modal('show');
	}

	onDelete(){
		this.message = null;
		this.error = null;
		this.subscription != null ? this.subscription.unsubscribe() : null;
		this.subscription = this._productService.deleteProduct(this.product.id).subscribe(res=>{
			if(res.message){
				this.message = res.message;
				this.products.splice(this.products.indexOf(this.product),1);
				this.refreshList();
			}
			if(res.error){
				this.error = res.error;
			}
		});
		jQuery(this.deleteModalElement.nativeElement).modal('hide');
	}

	trackByProducts(index: number, product: Product){
		return product.id;
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
			return this._productService.getProducts(this.currentPage,this.newTerm);
		}).subscribe(res =>{
			this.loading = false;
			this.oldTerm = this.newTerm;
			this.products = res.data;
			this.data = res;
			this.pagination = this._toolService.renderPagination(this.data,this.newTerm);

		});
	}

	refreshListManually(){
		this.loading = true;
		let subscription = this._productService.getProducts(this.currentPage || 1,this.newTerm)
		.subscribe(res =>{
			this.loading = false;
			this.products = res.data;
			this.data = res;
			this.pagination = this._toolService.renderPagination(this.data,this.newTerm);
			subscription.unsubscribe();
		});
	}

}
