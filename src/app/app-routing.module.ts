import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PoiListComponent } from './poi-list/poi-list.component';
import { TimeListComponent } from './time-list/time-list.component';

const routes: Routes = [
  { path: 'pois', component: PoiListComponent },
  { path: 'time', component: TimeListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
