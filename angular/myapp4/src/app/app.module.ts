import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppComponent } from './app.component';

import { ProductListComponent } from './product-list/product-list.component';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoadingIndicatorComponent } from './loading-indicator/loading-indicator.component';

import { ProductService } from './product.service';

import { DashboardService } from './dashboard.service';
import { ToolService } from './tool.service';
import { Config } from './app.config';



const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard',  component: DashboardComponent },
    { path: 'products',     component: ProductListComponent },
    { path: 'products/create', component: ProductCreateComponent },  
    { path: 'products/:id', component: ProductDetailComponent },
];

@NgModule({
    declarations: [
        AppComponent,
        
        ProductListComponent,
        ProductCreateComponent,
        ProductDetailComponent,

        DashboardComponent,
        LoadingIndicatorComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot(routes)
    ],
    providers: [
        Config,
        ProductService,
        DashboardService,
        ToolService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
