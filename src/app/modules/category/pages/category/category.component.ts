import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";
import { utilities } from '@utilities/utilities';
import { CategoriesDataProviderService } from '@core/services/categories-data-provider.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  catUID: number;
  catNode: string;
  catTitle: string;
  rootCatNode: string;
  rootCatTitle: string;
  catPopularName: string;
  mainCategoryImg: SafeStyle;
  isFav: boolean;
  flag: number;
  tabCategory: string = 'Sellers';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private categoryService: CategoriesDataProviderService,
    private _snackBar: MatSnackBar,
  ) {
    this.categoryService.categoriesObservable.pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.setCategoryDetails();
    });

    this.categoryService.categoryInfoObservable.pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.catUID = this.categoryService.catUID;
      this.catNode = this.categoryService.catNode;
      this.catTitle = this.categoryService.catTitle;
      this.catPopularName = this.categoryService.catName;
    });
    router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      //console.log(this.route.snapshot.paramMap)
      this.rootCatNode = this.route.snapshot.params.rootCatId
      this.rootCatTitle = this.route.snapshot.params.rootCatName
      this.categoryService.rootCatNode = this.rootCatNode;
      this.categoryService.rootCatTitle = this.rootCatTitle;
      let url = this.router.url;
      if (url.includes('bestdeals')) {
        this.tabCategory = 'Offers';
      } else if (url.includes('bestsellers')) {
        this.tabCategory = 'Sellers';
      } else {
        this.tabCategory = 'Gifts';
      }
      this.categoryService.setCategoryDetails(this.catUID);
      this.setCategoryDetails();
    });
  }

  ngOnInit(): void {
  }

  setCategoryDetails() {
    let json = this.categoryService.mainCategories
    //console.log(json)
    let self = this;
    for (let item of json) {
      if (item.nodeId == this.rootCatNode) {
        this.mainCategoryImg = this.sanitizer.bypassSecurityTrustStyle(`url(${item.categoryLogo})`);
        this.isFav = item.isFav;
        break;
      }
    };
  }

  public addtoFavorites($event) {
    $event.stopPropagation();
    $event.preventDefault();
    $event.srcElement.classList.add("no-pointer-event");
    let msg;

    if (this.isFav) {
      this.isFav = false;
      this.flag = 0;
      msg = this.rootCatTitle + " removed from Favorites";
    } else {
      this.isFav = true;
      this.flag = 1;
      msg = this.rootCatTitle + " added to Favorites";
    }
    const model = {
      chegCustomerId: utilities.getChegUID(),
      catId: this.catUID,
      name: this.rootCatTitle,
      flag: this.flag
    }
    this.categoryService.postFavouriteCategory(model)
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res) {
          this._snackBar.open(msg, '', {
            duration: 2000,
          });
          $event.srcElement.classList.remove("no-pointer-event");
        }
      }, err => {
      });

    let jsonObj = this.categoryService.mainCategories
    for (var i = 0; i < jsonObj.length; i++) {
      if (jsonObj[i].id === this.catUID) {
        jsonObj[i].isFav = this.isFav;
        return;
      }
    }
  }

  navigateToCategory(catUID: number, catNode: string, catTitle: string, isPopular: boolean, popularName: string, rootCatNode: string = '', rootCatTitle: string = '') {
    if (isPopular) {
      this.categoryService.gotoCategoryPagePopular(catUID, catNode, catTitle, this.rootCatNode, this.rootCatTitle, popularName);
    } else {
      this.categoryService.gotoCategoryPage(catUID, catNode, catTitle, this.rootCatNode, this.rootCatTitle);
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
