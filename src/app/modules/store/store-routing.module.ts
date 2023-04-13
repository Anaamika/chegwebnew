import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoresComponent } from './pages/stores/stores.component';
import { StoreComponent } from './pages/store/store.component'


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: StoresComponent,
      },
      {
        path: ':storeId/:storeName',
        component: StoreComponent,
        children: [
          {
            path: '',
            loadChildren: () => import('@module/offers/offers.module').then(m => m.OffersModule),
          },
          {
            path: 'giftcards',
            loadChildren: () => import('@module/gifts/gifts.module').then(m => m.GiftsModule),
          }
        ],
        data: {
          breadcrumb: ''
        },
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StoreRoutingModule { }
