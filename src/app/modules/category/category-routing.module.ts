import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from './pages/categories/categories.component'
import { CategoryComponent } from './pages/category/category.component'

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CategoriesComponent,
      },
      {
        path: ':rootCatId/:rootCatName',
        component: CategoryComponent,
        children: [
          {
            path: 'bestsellers',
            loadChildren: () => import('@module/products/products.module').then(m => m.ProductsModule),
          },
          {
            path: 'bestdeals',
            loadChildren: () => import('@module/offers/offers.module').then(m => m.OffersModule),
          },
          {
            path: 'giftcards',
            loadChildren: () => import('@module/gifts/gifts.module').then(m => m.GiftsModule),
          }
        ],
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
export class CategoryRoutingModule { }
