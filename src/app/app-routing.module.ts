import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from '@core/services/guards/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuardService]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/'
  },
  {
    path: 'categories',
    loadChildren: () => import('./modules/category/category.module').then(m => m.CategoryModule),
    data: {
      breadcrumb: 'All Categories',
    }
  },
  {
    path: 'stores',
    loadChildren: () => import('./modules/store/store.module').then(m => m.StoreModule),
    data: {
      breadcrumb: 'All Stores',
    }
  },
  {
    path: '',
    loadChildren: () => import('./modules/product/product.module').then(m => m.ProductModule),
    data: {
      breadcrumb: '',
    }
  },
  {
    path: 'gift-cards',
    loadChildren: () => import('./modules/gifts/gifts.module').then(m => m.GiftsModule),
    data: {
      breadcrumb: 'Buy Gift Cards',
    }
  },
  {
    path: 'account',
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule),
    data: {
      breadcrumb: 'My Account',
    },
    canActivate: [AuthGuardService]
  },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
