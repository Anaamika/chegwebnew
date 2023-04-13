import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BestdealsComponent } from './pages/bestdeals/bestdeals.component';

const routes: Routes = [{
  path: '',
  component: BestdealsComponent,
  data: {
    breadcrumb: ''
  },
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OffersRoutingModule { }
