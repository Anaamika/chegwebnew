import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { RecaptchaModule } from 'ng-recaptcha';

import * as fromPages from './pages';
import * as fromComponent from './components';


@NgModule({
  declarations: [...fromPages.pages, ...fromComponent.components],
  imports: [
    HomeRoutingModule,
    CarouselModule,
    SharedModule,
    RecaptchaModule,  //this is the recaptcha main module
  ],
  exports: [
  ],
})
export class HomeModule { }