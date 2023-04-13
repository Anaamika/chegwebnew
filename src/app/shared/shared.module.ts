import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ClipboardModule } from '@angular/cdk/clipboard';

import * as fromPipe from './pipe';
import * as fromComponent from './components';
import * as fromDirective from './directives';

import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from '@libraries/material.module';
import { MatIconModule } from '@angular/material/icon';
import { CategoryIconsComponent } from './components/category-icons/category-icons.component';

@NgModule({
  declarations: [...fromPipe.pipes, ...fromComponent.components, ...fromDirective.directives, CategoryIconsComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule,
    ClipboardModule,
    NgxPaginationModule,
    MaterialModule,
    MatIconModule
  ],
  exports: [...fromPipe.pipes, ...fromComponent.components, ...fromDirective.directives, CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MaterialModule, MatIconModule]
})
export class SharedModule { }
