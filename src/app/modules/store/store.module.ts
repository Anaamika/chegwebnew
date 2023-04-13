import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module'

import { StoreRoutingModule } from './store-routing.module';

import * as fromPages from './pages';
import * as fromComponent from './components';

@NgModule({
  declarations: [...fromPages.pages, ...fromComponent.components],
  imports: [
    SharedModule,
    StoreRoutingModule
  ],
  exports: [...fromComponent.components
  ],
})
export class StoreModule { }
