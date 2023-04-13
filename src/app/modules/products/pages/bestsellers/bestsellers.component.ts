import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { SearchService } from '@app/core/services/search.service';
import { CategoriesDataProviderService } from '@core/services/categories-data-provider.service';
import { utilities } from '@utilities/utilities';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { gsap, TweenMax, Circ } from "gsap/all";

gsap.registerPlugin(Circ);

@Component({
  selector: 'app-bestsellers',
  templateUrl: './bestsellers.component.html',
  styleUrls: ['./bestsellers.component.scss']
})
export class BestsellersComponent implements OnInit, OnDestroy {

  @ViewChild('filterBlock') filterBlock: ElementRef;

  destroy$: Subject<boolean> = new Subject<boolean>();
  //For categoryPage
  catUID: number;
  catNode: string;
  catTitle: string;
  rootCatNode: string
  rootCatTitle: string;
  categoriesData = [];
  categoriesSidebarData = {};

  catName: string = '';

  bestsellersData = [];
  initialData = [];
  productFilters = [];
  selectedFilters = [];
  isSelectedFiltersEmpty: boolean = true;
  //filterChanged = false;
  filterRemoved: string = null;
  keyWord: string = ''
  pageCount: number = 1;
  isBestSellers: boolean = false;
  isBestSellersSuggestion: boolean = false;
  disableNextBS: boolean = false;
  isPopularprod: boolean = false;
  disableNextPP: boolean = false;
  noProducts: boolean = false;
  pageName;
  showPagination: boolean = false;
  description: string = '';

  prodId: number;
  prodName: string = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService,
    private categoryService: CategoriesDataProviderService,
    private cd: ChangeDetectorRef,
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      this.catUID = +this.route.snapshot.paramMap.get('uid');
      this.catNode = this.route.snapshot.paramMap.get('cid');
      this.catTitle = this.route.snapshot.paramMap.get('cname');
      this.categoryService.catNode = this.catNode;
      this.categoryService.catTitle = this.catTitle;
      this.categoryService.catUID = this.catUID;
      this.rootCatNode = this.categoryService.rootCatNode;
      this.rootCatTitle = this.categoryService.rootCatTitle;

      this.filterRemoved = null;
      let url = this.router.url;
      this.selectedFilters = [];
      //console.log(this.route.snapshot.paramMap)
      if (url.includes('categories')) {
        this.pageName = "1";//For Best sellers
        this.catName = decodeURIComponent(this.route.snapshot.paramMap.get('cn'));
        this.categoryService.catName = this.catName;
        this.getAllSubCategories(this.catNode);
        if (this.catName == 'null' || this.catName == null || this.catName == '') {
          this.prodId = +this.route.snapshot.paramMap.get('pid');
          this.prodName = decodeURIComponent(this.route.snapshot.paramMap.get('pname'));
          if (this.prodId == null || this.prodId == 0) {
            this.getBestSellers(this.catNode, this.catTitle, this.pageCount);
            this.isBestSellers = true;
            this.isBestSellersSuggestion = false;
            this.isPopularprod = false;
            this.productFilters = [];
          } else {
            this.getBestSellersFromSuggestion(this.catNode, encodeURIComponent(this.prodName), this.prodId, this.pageCount)
            this.isBestSellers = false;
            this.isBestSellersSuggestion = true;
            this.isPopularprod = false;
            this.productFilters = [];
          }
        } else {
          this.pageName = "2";//For Popular Categories
          this.bestsellersData = [];
          this.getPopularProducts(0);
          this.isBestSellers = false;
          this.isBestSellersSuggestion = false;
          this.isPopularprod = true;
        }
      } else if (url.includes('search')) {
        this.pageName = "2";//For Popular Categories
        this.keyWord = decodeURIComponent(this.route.snapshot.paramMap.get('kw'));
        this.catName = decodeURIComponent(this.route.snapshot.paramMap.get('cn'));
        this.getPopularProducts(0);
        this.isBestSellers = false;
        this.isBestSellersSuggestion = false;
        this.isPopularprod = true;
      }


    });
  }

  ngOnInit(): void {
  }

  public getAllSubCategories(nodeId) {
    this.categoriesData = [];
    this.categoryService.getsubCategories(nodeId)
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res) {
          this.categoriesData = res;
        }
        this.getParentCategory(nodeId);
      }, err => {
      });
  }

  private getParentCategory(nodeId) {

    if (this.rootCatNode === this.catNode) {
      this.categoriesSidebarData = {};
      this.categoriesSidebarData["catUID"] = this.catUID;
      this.categoriesSidebarData["catNode"] = this.catNode;
      this.categoriesSidebarData["catTitle"] = this.catTitle;
      this.categoriesSidebarData["catLevel"] = 1;
      this.categoriesSidebarData["catPNode"] = this.catNode;
      this.categoriesSidebarData["catPTitle"] = this.catTitle;
      this.categoriesSidebarData["rootCatNode"] = this.rootCatNode;
      this.categoriesSidebarData["rootCatTitle"] = this.rootCatTitle;
      this.categoriesSidebarData["Data"] = this.categoriesData;
      this.setCategoryDetails();
    } else {
      this.categoryService.getParentCategory(nodeId)
        .pipe(takeUntil(this.destroy$)).subscribe(res => {
          if (res) {
            //this.categoryService.mainCategories
            this.categoriesSidebarData = {};
            this.catUID = +res[0].id;
            this.categoriesSidebarData["catUID"] = this.catUID;
            this.categoriesSidebarData["catNode"] = this.catNode;
            this.categoriesSidebarData["catTitle"] = this.catTitle;
            this.categoriesSidebarData["catLevel"] = res[0].categoryLevel;
            this.categoriesSidebarData["catPNode"] = res[0].parentNodeId;
            this.categoriesSidebarData["catPTitle"] = res[0].parentCategoryName;
            this.categoriesSidebarData["rootCatNode"] = res[0].rootID;
            this.categoriesSidebarData["rootCatTitle"] = res[0].rootCategoryName;
            this.categoriesSidebarData["Data"] = this.categoriesData;
            this.rootCatTitle = res[0].rootCategoryName;
            //this.cd.detectChanges();
            this.setCategoryDetails();
          }
        }, err => {
        });
    }
  }

  setCategoryDetails() {
    this.categoryService.setCategoryDetails(this.catUID);
  }

  public prevBestSellers() {
    if (this.pageCount !== 1) {
      this.pageCount = this.pageCount - 1;
      this.getBestSellers(this.catNode, this.catTitle, this.pageCount);
    }
  }

  public nextBestSellers() {
    this.pageCount = this.pageCount + 1;
    this.getBestSellers(this.catNode, this.catTitle, this.pageCount);
  }

  public getBestSellers(id, name, num) {
    this.searchService.getBestSellers(id, name, num).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.length > 0) {
        //console.log(res)
        this.bestsellersData = [];
        this.bestsellersData = res;
        this.initialData = res;
        this.showPagination = true;
        this.description = this.bestsellersData[0].categoryDescription;
        if (this.bestsellersData.length < 20) {
          this.disableNextBS = true;
        } else {
          this.disableNextBS = false;
        }
        this.cd.detectChanges();
      }
    }, err => {
    });
  }

  public prevBestSellersSuggestion() {
    if (this.pageCount !== 1) {
      this.pageCount = this.pageCount - 1;
      this.getBestSellersFromSuggestion(this.catNode, encodeURIComponent(this.prodName), this.prodId, this.pageCount);
    }
  }

  public nextBestSellersSuggestion() {
    this.pageCount = this.pageCount + 1;

    this.getBestSellersFromSuggestion(this.catNode, encodeURIComponent(this.prodName), this.prodId, this.pageCount);
  }

  public getBestSellersFromSuggestion(nodeId, prodName, prodId, num) {
    this.searchService.getBestSellersFromSuggestion(nodeId, prodName, prodId, num).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.length > 0) {
        this.bestsellersData = [];
        this.bestsellersData = res;
        this.initialData = res;
        this.showPagination = true;
        this.description = this.bestsellersData[0].categoryDescription;
        if (this.bestsellersData.length < 20) {
          this.disableNextBS = true;
        } else {
          this.disableNextBS = false;
        }
        this.cd.detectChanges();
      }
    }, err => {
    });
  }

  getPopularProducts(pageNo: number) {
    let objData = Object.assign({}, this.selectedFilters);  //this is how you assign object to new variable without affecting orginal object. else change to model will change selectedFilters Also.
    objData['catName'] = this.catName;
    objData['keyword'] = this.keyWord;
    objData['pageNo'] = pageNo === 0 ? 1 : pageNo;

    if (pageNo === 0) {
      let val: number = this.route.snapshot.paramMap.keys.length;
      for (let i = 0; i < val; i++) {
        let fn = this.route.snapshot.paramMap.keys[i];
        if (fn != 'kw' && fn != 'cn' && fn != 'qry' && fn != 'cid' && fn != 'cname' && fn != 'uid' && fn != 'pname' && fn != 'pid') {
          let arrayfn1 = [];
          if (fn.toLowerCase() == 'price') {
            let price_filter = this.route.snapshot.paramMap.get(fn);
            let minPrice = price_filter.split('-')[0];
            let maxPrice = price_filter.split('-')[1];
            arrayfn1 = new Array(minPrice, maxPrice);
          } else {
            arrayfn1 = new Array(this.route.snapshot.paramMap.get(fn));
          }
          objData[fn] = arrayfn1;
        }
      }
    } else {
      if (objData['Price'] !== undefined) {
        if (objData['Price'].length > 0) {
          let arrPrice = [];
          let value = objData['Price'][0];

          value = value.replace(/,/g, "");  //replace comma from string
          let str = value.charAt(0);;
          arrPrice = value.match(/\d+/g).map(Number);  // return number from string as array Ex: if string is: ₹ 175000 to ₹ 350000; it returns [175000, 350000]
          if (arrPrice.length == 1) {
            if (str == 'u') {
              arrPrice.unshift(0);
            } else {
              arrPrice.push(0);
            }
          }
          objData['Price'] = arrPrice;
        } else {
          objData['Price'] = [];
        }
      }
    }

    // console.log(objData)
    this.searchService.getFilteredProducts(objData).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.length > 0) {
        this.bestsellersData = res;
        this.showPagination = true;
        if (pageNo === 0) {
          this.initialData = res;
          this.getPopularProductsFilters()
        }
        if (this.bestsellersData.length > 0) {
          this.noProducts = false;
        } else {
          this.noProducts = true;
        }
        if (this.bestsellersData.length < 24) {
          this.disableNextPP = true;
        } else {
          this.disableNextPP = false;
        }
      }
      else {
        this.bestsellersData = [];
        if (this.keyWord) {
          this.router.navigate(["product/" + this.keyWord]);
        } else {
          this.noProducts = true;
        }
      }
    }, err => { console.log(err); });
  }

  getPopularProductsFilters() {
    this.searchService.getPopularProductsFilters(this.catName).pipe(takeUntil(this.destroy$)).subscribe(res => {
      // console.log(res)
      if (res) {
        this.productFilters = [];
        if (res.popularFilter.Price !== undefined) {
          let maxPrice = +res.popularFilter.Price.values[0]
          let min = 0;
          let len = Math.ceil(Math.log10(maxPrice + 1));
          len = len - 2;
          let tens = Math.pow(10, len);
          maxPrice = Math.ceil(maxPrice / tens) * tens;
          let step = maxPrice / 2;
          step = step / 2;
          let arrPriceRange = [];
          let arr = this.generateRange(min, maxPrice, step)

          for (let i = 1; i < arr.length; i++) {
            if (i == 1) {
              let num = arr[i].toFixed(1).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,')
              num = num.split('.');
              arrPriceRange.push('under ₹ ' + num[0])
            } else {
              let num1 = arr[i - 1].toFixed(1).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,');
              let num2 = arr[i].toFixed(1).replace(/(\d)(?=(\d{2})+\d\.)/g, '$1,')
              num1 = num1.split('.');
              num2 = num2.split('.');
              arrPriceRange.push('₹ ' + num1[0] + ' to ₹ ' + num2[0])
            }

          }
          res.popularFilter.Price.values = arrPriceRange;
        }

        this.productFilters = res.popularFilter;
        this.description = res.categoryDescription;

      }
    }, err => { console.log(err); });
  }

  receiveFilter($event) {
    this.selectedFilters = $event;
    //console.log(this.selectedFilters)
    if (utilities.checkIfObjValuesEmpty($event)) {
      this.bestsellersData = this.initialData;
    } else {
      this.pageCount = 1;
      this.getPopularProducts(this.pageCount);
    }
    this.isSelectedFiltersEmpty = utilities.checkIfObjValuesEmpty(this.selectedFilters);
    this.cd.detectChanges();
  }

  removeFilter(name, main) {
    //this.filterChanged = true;
    let arr = utilities.removeItemOnce(this.selectedFilters[main], name);
    this.selectedFilters[main] = arr;
    this.filterRemoved = name;
    this.cd.detectChanges();
    //this.filterChanged = false;
  }

  public showFilters($event) {
    $event.preventDefault();
    let elem = this.filterBlock.nativeElement.querySelector('.mobile-filter');
    TweenMax.to(elem, .2, { top: '0', opacity: 1, ease: Circ.easeOut });
  }

  public prevPopularProducts() {
    if (this.pageCount !== 1) {
      this.pageCount = this.pageCount - 1;
      this.getPopularProducts(this.pageCount);
    }
  }

  public nextPopularProducts() {
    this.pageCount = this.pageCount + 1;
    this.getPopularProducts(this.pageCount);
  }

  generateRange(min, max, step) {
    let arr = [];
    for (let i = min; i <= max; i += step) {
      arr.push(i);
    }
    return arr;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  options: AnimationOptions = {
    path: '../../../../../assets/json/sad-empty-box.json'
  };

  styles: Partial<CSSStyleDeclaration> = {
    maxWidth: '300px',
    margin: '0',
  };

  animationCreated(animationItem: AnimationItem): void {
    //console.log(animationItem);
  }

  onLoopComplete(): void {
  }

}
