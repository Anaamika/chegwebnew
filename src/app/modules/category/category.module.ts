import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { CategoryRoutingModule } from './category-routing.module';

import * as fromPages from './pages';
import * as fromComponent from './components';
@NgModule({
  declarations: [...fromPages.pages, ...fromComponent.components],
  imports: [
    SharedModule,
    CategoryRoutingModule
  ],
  exports: [
  ],
})
export class CategoryModule { }
