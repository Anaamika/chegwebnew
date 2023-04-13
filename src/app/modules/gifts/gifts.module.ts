import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { GiftsRoutingModule } from './gifts-routing.module';
import * as fromPages from './pages';


@NgModule({
  declarations: [...fromPages.pages],
  imports: [
    SharedModule,
    GiftsRoutingModule
  ]
})
export class GiftsModule { }
