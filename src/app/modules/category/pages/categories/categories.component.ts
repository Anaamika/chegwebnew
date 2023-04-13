import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CategoriesDataProviderService } from '@core/services/categories-data-provider.service'
import { TitleService } from '@app/core/services/title.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit, OnDestroy {


  destroy$: Subject<boolean> = new Subject<boolean>();
  favcategoriesData = [];
  categoriesgridData = [];

  constructor(
    private titleService: TitleService,
    private categoryService: CategoriesDataProviderService,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Best sellers: top offers and discount coupons ");
    this.titleService.updateDescription("Best offers, discounts, and sale on top categories. Get up to 60% off on best-selling products.")
    this.getAllMainCategories();
  }

  private getAllMainCategories() {

    let mcData = this.categoryService.mainCategories;
    if (mcData.length == 0) {
      this.categoryService.categoriesObservable.pipe(takeUntil(this.destroy$)).subscribe(res => {
        let data = this.categoryService.mainCategories;
        this.categoriesgridData = data;
        this.favcategoriesData = data.slice(0, 10);
      });
    } else {
      this.categoriesgridData = mcData;
      this.favcategoriesData = mcData.slice(0, 10);
    }

    // this.categoryService.getmainCategories()
    //   .pipe(takeUntil(this.destroy$)).subscribe(res => {
    //     if (res.length > 0) {
    //       this.categoriesgridData = res;
    //       this.favcategoriesData = res;
    //       this.favcategoriesData = this.favcategoriesData.slice(0, 10);
    //     }
    //   }, err => {
    //   });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}