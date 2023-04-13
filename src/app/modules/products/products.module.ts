import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { ProductsRoutingModule } from './products-routing.module';
import { LottieModule } from 'ngx-lottie';
import * as fromPages from './pages';


// Note we need a separate function as it's required
// by the AOT compiler.
export function playerFactory() {
  return import(/* webpackChunkName: 'lottie-web' */ 'lottie-web');
}
@NgModule({
  declarations: [...fromPages.pages],
  imports: [
    SharedModule,
    ProductsRoutingModule,
    LottieModule.forRoot({ player: playerFactory })
  ],
  exports: [...fromPages.pages],
})
export class ProductsModule { }
