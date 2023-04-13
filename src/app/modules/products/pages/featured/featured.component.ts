import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { DialogService } from '@core/services/dialog.service';
import { CategoriesDataProviderService } from '@core/services/categories-data-provider.service';
import { SearchService } from '@app/core/services/search.service';
import { utilities } from '@app/utilities/utilities';
import { AppConstants } from '@app/config/app-constants';
import { impressionData } from '@app/shared/models/impression-data';

@Component({
  selector: 'app-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.scss']
})
export class FeaturedComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  catId: number;
  title: string;
  featuredCatDataAll: Array<object> = [];
  subCatData: Array<object> = [];
  productsData: Array<object> = [];
  selected = 'REL';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoriesDataProviderService,
    private dialogService: DialogService,
    private authService: AuthService,
    private searchService: SearchService,
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      //console.log(this.route.snapshot.paramMap)
      this.catId = +this.route.snapshot.paramMap.get('id')
      this.title = this.route.snapshot.paramMap.get('name')
      this.featuredCatDataAll = this.categoryService.featuredCategoriesAll;
      if (this.featuredCatDataAll.length > 0) {
        this.getSubCategories(this.catId);
      } else {
        this.getFeaturedCategories();
      }
      this.getFeaturedProducts(this.catId);
    });
  }

  ngOnInit(): void {
  }

  private getFeaturedProducts(id: number) {
    this.categoryService.getFeaturedProducts(id)
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res) {
          //console.log(res)
          this.productsData = res;
        }
      }, err => {
      });
  }

  private getFeaturedCategories() {
    this.categoryService.getFeaturedCategories().pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.length > 0) {
        this.featuredCatDataAll = this.categoryService.featuredCategoriesAll;
        this.getSubCategories(this.catId);
      }
    }, err => {
    });
  }

  private getSubCategories(id: number) {
    for (let i = 0; i < this.featuredCatDataAll.length; i++) {
      if (this.featuredCatDataAll[i]['parentCatId'] == id) {
        this.subCatData.push(this.featuredCatDataAll[i]);
      }
    }
  }

  postProductInfo($event, data) {
    $event.stopPropagation();
    $event.preventDefault();
    this.onVisible(data,'Click')
    let isEligibleForCashback = utilities.isAccountTypeA();
    if (isEligibleForCashback) {
      if (this.authService.isAuthenticated() || this.authService.isGuestUSer()) {
        this.shop(data);
      } else {
        utilities.addHTMLClass(['login_page']);
        const options = {
          title: 'Product',
          message: 'Verify',
          data: data,
          cancelText: 'Cancel',
          confirmText: 'Confirm'
        };
        this.dialogService.openLogin(options);
        this.dialogService.loginConfirmed().subscribe(confirmed => {
          if (confirmed) {
            //this.shop(data);
          }
          utilities.removeHTMLClass(['login_page']);
        });
      }

    } else {
      this.shop(data);
    }
  }

  shop(data) {
    const model = utilities.generateProductInfoObject(data, 'Product', null);
    this.searchService.postProductInfo(model).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
      }
    }, err => {
    });
  }

  toggleproductsData(value) {
    if (value == 'LTH') {
      this.productsData.sort(utilities.sortBY('price', 'asc'))
    } else if (value == 'HTL') {
      this.productsData.sort(utilities.sortBY('price', 'desc'))
    } else if (value == 'REL') {
      this.productsData.sort(utilities.sortBY('productRank', 'asc'))
    }
  }

  onVisible(data,eventType) {
    //console.log(type, data);
    let arrayObj = new impressionData();
    arrayObj.type = eventType;
    arrayObj.page_name = 'custom_category_page';
    arrayObj.section = 'Trending Categories';
    arrayObj.idType = 'custom_category';
    arrayObj.name = data.productName;
    //console.log(arrayObj)
    utilities.saveImpressionDetails(arrayObj);
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
