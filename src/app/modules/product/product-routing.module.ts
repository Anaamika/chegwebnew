import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './pages/product/product.component';
import { SearchComponent } from './pages/search/search.component';
import { CompareComponent } from './pages/compare/compare.component';
import { PnbProductComponent } from './pages/pnb-product/pnb-product.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'product/:qry',
        component: PnbProductComponent,
        pathMatch: 'prefix',
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'product/:qry/:catId/:catName',
        component: ProductComponent,
        pathMatch: 'prefix',
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'search/:qry',
        component: SearchComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('@module/products/products.module').then(m => m.ProductsModule),
          }
        ],
        pathMatch: 'prefix',
        data: {
          breadcrumb: ''
        }
      },
      {
        path: 'compare/:qry',
        component: CompareComponent,
        pathMatch: 'prefix',
        data: {
          breadcrumb: ''
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
