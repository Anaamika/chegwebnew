import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';

import { UserRoutingModule } from './user-routing.module';
import { MaterialModule } from '@libraries/material.module';
import { NgxPaginationModule } from 'ngx-pagination';

import * as fromPages from './pages';
import * as fromComponent from './components';

@NgModule({
  declarations: [...fromPages.pages, ...fromComponent.components],
  imports: [SharedModule, UserRoutingModule, MaterialModule, NgxPaginationModule],
  exports: [MaterialModule],
})
export class UserModule { }
