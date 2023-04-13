import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BestsellersComponent } from './pages/bestsellers/bestsellers.component';
import { CompareComponent } from './pages/compare/compare.component';
import { FeaturedComponent } from './pages/featured/featured.component';

const routes: Routes = [{
  path: '',
  component: BestsellersComponent,
  data: {
    breadcrumb: ''
  },
},
{
  path: 'm/:id/:name',
  data: {
    breadcrumb: ''
  },
  children: [
    {
      path: '',
      component: FeaturedComponent,
    },
    {
      path: 's/:id/:name',
      component: FeaturedComponent,
      pathMatch: 'full',
      data: {
        breadcrumb: ''
      },
    }
  ]
},
{
  path: 'compare/:qry',
  component: CompareComponent,
  pathMatch: 'prefix',
  data: {
    breadcrumb: ''
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
