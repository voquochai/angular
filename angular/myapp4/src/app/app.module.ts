import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { AppComponent } from './app.component';
import { ParentListComponent } from './parent-list/parent-list.component';
import { ParentCreateComponent } from './parent-create/parent-create.component';
import { ParentDetailComponent } from './parent-detail/parent-detail.component';
import { KidListComponent } from './kid-list/kid-list.component';
import { KidCreateComponent } from './kid-create/kid-create.component';
import { KidDetailComponent } from './kid-detail/kid-detail.component';
import { AttendanceListComponent } from './attendance-list/attendance-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { ParentService } from './parent.service';
import { KidService } from './kid.service';
import { AttendanceService } from './attendance.service';
import { DashboardService } from './dashboard.service';

import { Config } from './app.config';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard',  component: DashboardComponent },
    { path: 'parents',     component: ParentListComponent },
    { path: 'parents/create', component: ParentCreateComponent },  
    { path: 'parents/:id', component: ParentDetailComponent },
    { path: 'kids',     component: KidListComponent },
    { path: 'kids/create', component: KidCreateComponent },  
    { path: 'kids/:id', component: KidDetailComponent },      
    { path: 'attendances',     component: AttendanceListComponent },
];

@NgModule({
    declarations: [
        AppComponent,
        ParentListComponent,
        ParentCreateComponent,
        ParentDetailComponent,
        KidListComponent,
        KidCreateComponent,
        KidDetailComponent,
        AttendanceListComponent,
        DashboardComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule.forRoot(routes)
    ],
    providers: [
        Config,
        ParentService,
        KidService,
        AttendanceService,
        DashboardService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
