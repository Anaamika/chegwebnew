import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { ProductRoutingModule } from './product-routing.module';

import { LottieModule } from 'ngx-lottie';

import * as fromPages from './pages';
import * as fromComponent from '../product/components';



// Note we need a separate function as it's required
// by the AOT compiler.
export function playerFactory() {
  return import(/* webpackChunkName: 'lottie-web' */ 'lottie-web');
}

@NgModule({
  declarations: [...fromPages.pages, ...fromComponent.components],
  imports: [
    SharedModule,
    ProductRoutingModule,
    LottieModule.forRoot({ player: playerFactory })
  ],
  exports: [...fromComponent.components],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
 
})
export class ProductModule { }
