import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GiftCardsComponent } from './pages/gift-cards/gift-cards.component';
import { BuyGiftCardComponent } from './pages/buy-gift-card/buy-gift-card.component';

const routes: Routes = [{
  path: '',
  children: [
    {
      path: '',
      component: GiftCardsComponent,
    },
    {
      path: ':gcID/:gcName',
      component: BuyGiftCardComponent,
      data: {
        breadcrumb: ''
      },
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GiftsRoutingModule { }
