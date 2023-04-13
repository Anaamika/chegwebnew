import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { SearchService } from '@core/services/search.service';
import { DialogService } from '@core/services/dialog.service';
import { StorageService } from '@core/services/storage.service';
import { StoresDataProviderService } from '@core/services/stores-data-provider.service';

import { utilities } from '@app/utilities/utilities';
import { DOCUMENT } from '@angular/common';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-auto-searchbox',
  templateUrl: './auto-searchbox.component.html',
  styleUrls: ['./auto-searchbox.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('.3s ease-in', style({ opacity: '1' })),
      ]),
    ]),
  ],
})
export class AutoSearchboxComponent implements OnInit {

  constructor(
    private searchService: SearchService,
    private dialogService: DialogService,
    private storageService: StorageService,
    private storeService: StoresDataProviderService,
    public ele: ElementRef,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
  ) { }

  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild(MatAutocomplete) matAutocomplete: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;
  searchQuery: string = "";
  amazonSuggestions: Array<object> = [];
  amazonSuggestionsTmpArray: Array<object> = [];
  pgMsg: object;
  searchHistory: Array<object> = [];
  popularHistory: Array<object> = [];
  popularSuggestions: Array<object> = [];
  keywordSuggestions: Array<object> = [];
  recentSuggestions: Array<object> = [];
  trendingSuggestions: Array<object> = [];
  categorySuggestions: Array<object> = [];
  storeSuggestions: Array<object> = [];
  couponSuggestions: Array<object> = [];
  matOption = null;
  hideTrending: boolean = false;

  ngOnInit(): void {
    if (this.storageService.isKeyExistInLocal('searchHistory')) {
      let arr = this.storageService.getLocalStorage('searchHistory');
      this.searchHistory = arr.slice(0, 5);
      this.recentSuggestions = this.searchHistory;
      this.storageService.setLocalStorage('searchHistory', this.searchHistory);
    } else {
      this.searchHistory = [];
    }
  }

  keydownEnter(event) {
    let self = this;
    let count: number = 0;
    if (this.matAutocomplete.options.length == 0) {
      self.searchForCompare();
    } else {
      if (this.matOption === null) {
        this.matAutocomplete.options.forEach(function (item: any) {
          if (item.value.trim().toLowerCase() === self.searchQuery.trim().toLowerCase()) {
            count = count + 1;
            if (count === 1) {
              item.setActiveStyles();
            }
          }
        });
        let len = this.matAutocomplete.options.length - 1;
        this.matAutocomplete.options.forEach(function (item: any, index) {
          if (item._active) {
            let el: HTMLElement = item._element.nativeElement;
            el.click();
          } else {
            if (len === index) {
              self.searchForCompare();
            }
          }
        });
      } else {
        let el: HTMLElement = self.matOption[0]._element.nativeElement;
        el.click();
      }
    }
  }

  onPaste(event: ClipboardEvent) {
    let clipboardData = event.clipboardData;
    let pastedText = clipboardData.getData('text');
    this.getAutoComplete(pastedText);
    setTimeout(() => {
      this.autocomplete.openPanel()
    }, 500);
  }

  // onBlur(event) {
  //   console.log('blur')
  //   let query = this.searchQuery.toLowerCase();
  //   this.getAutoComplete(query);
  // }

  onKeyUp(event) {
    //console.log('keyup')
    this.matOption = null;
    if (event.key == "ArrowDown" || event.key == "ArrowUp") {
      this.matOption = this.matAutocomplete.options.filter(item => item.active);
    } else {
      setTimeout(() => {
        let query = this.searchQuery.toLowerCase();
        this.getAutoComplete(query);
      }, 500);
    }
  }

  setActiveStyles() {
    let self = this;
    let count: number = 0;
    this.matAutocomplete.options.forEach(function (item: any) {
      if (item.value.trim().toLowerCase() === self.searchQuery.trim().toLowerCase()) {
        count = count + 1;
        if (count === 1) {
          item.setActiveStyles();
        }
      }
    });
  }

  public searchForCompare() {
    if (this.searchQuery != '') {
      let obj = {};
      let data = this.searchQuery;
      if (utilities.ifObjInArray(this.searchHistory, 'keyword', data)) {
        let index = this.searchHistory.findIndex(el => el['keyword'] == data);
        this.searchHistory.splice(index, 1);
      }
      obj['type'] = 'product2';
      obj['keyword'] = data;
      this.searchHistory.unshift(obj);

      this.recentSuggestions = this.searchHistory;
      this.storageService.setLocalStorage('searchHistory', this.searchHistory);
      console.log('1=>');
      this.router.navigate(['product/' + encodeURIComponent(data)]);
      this.searchInput.nativeElement.blur();
      this.searchQuery = '';
      this.autocomplete.closePanel();
    }
  }

  public serachProducts(data) {
    if (utilities.ifObjInArray(this.searchHistory, 'keyword', data.keyword)) {
      let index = this.searchHistory.findIndex(el => el['keyword'] == data.keyword);
      this.searchHistory.splice(index, 1);
    }
    data['type'] = 'product1';
    this.searchHistory.unshift(data);

    this.recentSuggestions = this.searchHistory;
    let fn1 = '', fn2 = '', fn3 = '';

    let obj: any = [];
    fn1 = data.filtername1 == null || data.filtername1 == undefined ? '' : data.filtername1;
    fn2 = data.filtername2 == null || data.filtername2 == undefined ? '' : data.filtername2;
    fn3 = data.filtername3 == null || data.filtername3 == undefined ? '' : data.filtername3;

    obj['kw'] = data.keyword;
    obj['cn'] = data.flip_Cat;
    if (data.filtervalue1 != '' && data.filtervalue1 != null && data.filtervalue1 != undefined) {
      obj[fn1] = data.filtervalue1;
    }
    if (data.filtervalue2 != '' && data.filtervalue2 != null && data.filtervalue2 != undefined) {
      obj[fn2] = data.filtervalue2;
    }
    if (data.filtervalue3 != '' && data.filtervalue3 != null && data.filtervalue3 != undefined) {
      obj[fn3] = data.filtervalue3;
    }
    this.storageService.setLocalStorage('searchHistory', this.searchHistory);
    this.router.navigate(['search/', data.cheg_Cat, obj]);
    //this.router.navigate(['search/', data.cheg_Cat, { kw: data.keyword, cn: data.flip_Cat,[fn1]:data.filtervalue1,[fn2]:data.filtervalue2,[fn3]:data.filtervalue3 }]);
    this.searchInput.nativeElement.blur();
    this.searchQuery = '';
    this.autocomplete.closePanel();
  }

  public clearRecentKeyword($event, index) {
    $event.stopPropagation();
    $event.preventDefault();
    this.searchHistory.splice(index, 1);
    this.storageService.setLocalStorage('searchHistory', this.searchHistory);
  }

  async getRecentTrends(e): Promise<void> {
    // window.scrollBy(0, 200);
    // this.renderer.addClass(this.document.body, 'overflow-hidden');
    // setTimeout(() => {

    // }, 0);

    //Get Trending Suggestions
    this.searchService.getTrendingKeywords().subscribe(res => {
      if (res.length > 0) {
        this.trendingSuggestions = res;
      }
    }, err => {
    });
    let query = this.searchQuery.toLowerCase();
    this.getAutoComplete(query);
  }

  async getAutoComplete(query): Promise<void> {
    if (query !== "") {
      this.searchService.getamazonSuggestionsOnSearch(query).subscribe(res => {
        // console.log(res)
        let data: Array<object> = res[1];
        this.amazonSuggestionsTmpArray = [];
        if (data !== null) {
          let dataTmp = res[1];
          for (var setIndex = dataTmp.length - 1; setIndex > 0; setIndex--) {
            var product = { productName: "" };
            product.productName = dataTmp[setIndex];
            this.amazonSuggestionsTmpArray.push(product);
          }
          if (this.amazonSuggestionsTmpArray.length === 0) {
            this.amazonSuggestions = [];
          } else {
            this.amazonSuggestions = utilities.sortArrayObjectByLength(this.amazonSuggestionsTmpArray, 'productName');
          }
        } else {
          this.amazonSuggestions = [];
        }
      },
        err => { this.pgMsg = { msg: err.error, alert: "alert-danger" }; }
      );

      // if (query.length >= 2) {
      //   //Get Popular Suggestions
      //   this.searchService.getPopularSuggestionsOnSearch(query).subscribe(res => {
      //     if (res.length > 0) {
      //       //console.log(res);
      //       this.popularSuggestions = res.filter(cate => +cate.rootID == 0);
      //     } else {
      //       this.popularSuggestions = [];
      //     }
      //   }, err => {
      //   });
      // }

      if (query.length >= 2) {
        //Get Keyword Suggestions
        this.searchService.getKeywordSuggestionsOnSearch(query).subscribe(res => {
          if (res.length > 0) {
            this.keywordSuggestions = utilities.sortArrayObjectByLength(res.filter(keyword => keyword.keyword.toString().toLocaleLowerCase().indexOf(query) !== -1), 'keyword');
          } else {
            this.keywordSuggestions = [];
          }
        }, err => {
        });
      }

      //Get Category Suggestions
      this.searchService.getCategorySuggestionsOnSearch(query).subscribe(res => {
        if (res.length > 0) {
          //console.log(res)
          this.categorySuggestions = utilities.sortArrayObjectByLength(res.filter(cate => cate.categoryName.toString().toLocaleLowerCase().indexOf(query) !== -1), 'categoryName');
        } else {
          this.categorySuggestions = [];
        }
      }, err => {
      });

      //Get Store Suggestions

      let stoData = this.storeService.allStores;
      //console.log(stoData)
      if (stoData.length > 0) {
        this.storeSuggestions = utilities.sortArrayObjectByLength(stoData.filter(store => store.siteName.toString().toLocaleLowerCase().indexOf(query) !== -1), 'siteName');
      }


      // this.searchService.getStoreSuggestionsOnSearch(query).subscribe(res => {
      //   if (res.length > 0) {
      //     console.log(res)
      //     //this.storeSuggestions = utilities.sortArrayObjectByLength(res.filter(store => store.merchantName.toString().toLocaleLowerCase().indexOf(query) !== -1), 'merchantName');
      //   } else {
      //     this.storeSuggestions = [];
      //   }
      // }, err => {
      // });

      // //Get Coupon Suggestions
      // this.searchService.getCouponSuggestionsOnSearch(query).subscribe(res => {
      //   if (res.length > 0) {
      //     //console.log(res)
      //     this.couponSuggestions = utilities.sortArrayObjectByLength(res.filter(cpn => cpn.offer.toString().toLocaleLowerCase().indexOf(query) !== -1), 'offer');
      //   } else {
      //     this.couponSuggestions = [];
      //   }
      // }, err => {
      // });

      this.hideTrending = true;
      this.autocomplete.openPanel()
    } else {
      this.amazonSuggestions = [];
      this.keywordSuggestions = [];
      this.popularSuggestions = [];
      this.categorySuggestions = [];
      this.storeSuggestions = [];
      this.couponSuggestions = [];
      this.hideTrending = false;
    }
  }

  saveCategoryInfo(data) {
    let obj = {};
    if (utilities.ifObjInArray(this.searchHistory, 'keyword', data.categoryName)) {
      let index = this.searchHistory.findIndex(el => el['keyword'] == data.categoryName);
      this.searchHistory.splice(index, 1);
    }
    obj['type'] = 'category';
    obj['keyword'] = data.categoryName;
    obj['rootID'] = data.rootID;
    obj['rootCategoryName'] = data.rootCategoryName;
    obj['nodeId'] = data.nodeId;
    obj['categoryName'] = data.categoryName;
    obj['popularName'] = data.popularName;
    obj['id'] = data.id;

    this.searchHistory.unshift(obj);
    this.recentSuggestions = this.searchHistory;
    this.storageService.setLocalStorage('searchHistory', this.searchHistory);
    this.searchQuery = '';
    this.searchInput.nativeElement.blur();
  }

  saveBestSellerInfo(data) {
    let obj = {};
    if (utilities.ifObjInArray(this.searchHistory, 'keyword', data.productName)) {
      let index = this.searchHistory.findIndex(el => el['keyword'] == data.productName);
      this.searchHistory.splice(index, 1);
    }
    obj['type'] = 'bestseller';
    obj['keyword'] = data.productName;
    obj['productName'] = data.productName;
    obj['prediction'] = data.prediction;
    obj['rootID'] = data.rootID;
    obj['parentCategoryName'] = data.parentCategoryName;
    obj['nodeId'] = data.nodeId;
    obj['catName'] = data.catName;
    obj['catId'] = data.catId;
    obj['id'] = data.id;

    this.searchHistory.unshift(obj);
    this.recentSuggestions = this.searchHistory;
    this.storageService.setLocalStorage('searchHistory', this.searchHistory);
    this.searchQuery = '';
    this.searchInput.nativeElement.blur();
  }


  saveStoreInfo(data) {
    let obj = {};
    if (utilities.ifObjInArray(this.searchHistory, 'keyword', data.siteName)) {
      let index = this.searchHistory.findIndex(el => el['keyword'] == data.siteName);
      this.searchHistory.splice(index, 1);
    }
    obj['type'] = 'store';
    obj['keyword'] = data.siteName;
    obj['siteID'] = data.siteID;
    obj['siteName'] = data.siteName;

    this.searchHistory.unshift(obj);
    this.recentSuggestions = this.searchHistory;
    this.storageService.setLocalStorage('searchHistory', this.searchHistory);
    this.searchQuery = '';
    this.searchInput.nativeElement.blur();
  }

  getOfferInfo($event, data) {
    $event.stopPropagation();
    $event.preventDefault();

    if (utilities.ifObjInArray(this.searchHistory, 'keyword', data.offer)) {
      let index = this.searchHistory.findIndex(el => el['keyword'] == data.offer);
      this.searchHistory.splice(index, 1);
    }
    data['type'] = 'offer';
    data['keyword'] = data.offer;

    this.searchHistory.unshift(data);
    this.recentSuggestions = this.searchHistory;
    this.storageService.setLocalStorage('searchHistory', this.searchHistory);

    let options = {
      title: data.offer,
      couponType: data.couponType,
      couponCode: data.couponCode,
      merchantName: data.merchantName,
      merchantUrl: data.merchantUrl,
      merchantLogo: data.merchantLogo,
      offerDetail: data.offerDetail,
      offerAdditionalLink: data.offerAdditionalLink,
      offerAdditionalInfo: data.offerAdditionalInfo,
      offerTerms: data.terms,
      offerTermsLink: data.termsLink,
      rewardTitle: data.redeemTitle,
      rewardDescription: data.redeemTitle,
      rewardTerms: data.termsAndConditions,
      discountAmount: data.discountAmount,
      discountType: data.discountType,
      promoLink: data.promoLink,
      id: data.id,
      siteId: data.siteId,
      category: data.category,
      likeCount: data.likeCount,
      cancelText: 'CLOSE',
      confirmText: 'YES, LEAVE PAGE'
    };

    this.dialogService.openOfferInfo(options);

    this.dialogService.offerInfoConfirmed().subscribe(confirmed => {
      if (confirmed) {
        //console.log('save')
        // this.saveData();
      }
    });
    this.searchQuery = '';
    this.searchInput.nativeElement.blur();
  }

  trackByPopularSuggestions(index, item) {
    return item.keyword;
  }

  trackByKeywordSuggestions(index, item) {
    return item.keyword;
  }

  trackByCategorySuggestions(index, item) {
    return item.categoryName;
  }

  trackByStoreSuggestions(index, item) {
    return item.merchantName;
  }

  trackByCouponSuggestions(index, item) {
    return item.offer;
  }

  trackByAmazonSuggestions(index, item) {
    return item.productName;
  }
}
