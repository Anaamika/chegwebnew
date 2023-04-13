import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { StorageService } from '@core/services/storage.service';
import { SearchService } from '@app/core/services/search.service';
import { AuthService } from '@core/services/auth.service';
import { DialogService } from '@core/services/dialog.service';
import { AppConstants } from '@app/config/app-constants';
import { utilities } from '@utilities/utilities';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { impressionData } from '@app/shared/models/impression-data';

@Component({
  selector: 'app-pnb-product',
  templateUrl: './pnb-product.component.html',
  styleUrls: ['./pnb-product.component.scss']
})
export class PnbProductComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  searchQuery: string;
  searchResult: any = [];
  similarProducts: any = [];
  moreProducts: any;


  searchedProductFound = false;
  moreItemFound: boolean = false;
  currentGroupId = 0;
  cateId = '0';
  priceRange = 0;

  sites: any;
  catSites = [];
  defaultSite = [];
  otherSites = [];

  moreOptions: any;
  rangeArr = [0, 1000, 5000, 10000, 15000, 20000, 40000, 70000, 1200000];
  lowRange = 0;
  highRange = 0;
  productGroup = '';
  parentSiteName1 = 'Amazon';
  parentSiteName2 = 'Flipkart';
  pgMsg: any;
  productData = [];
  selectedGroup: string = '';
  selectedStore: string = '';
  selectedCategory: string = '';
  noProducts: boolean = false;
  searchedProduct: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService,
    private dialogService: DialogService,
    private authService: AuthService,
    private storageService: StorageService,
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      this.searchedProduct = decodeURIComponent(this.route.snapshot.paramMap.get('qry'));
      this.selectedGroup = this.route.snapshot.paramMap.get('page') == null ? '' : this.route.snapshot.paramMap.get('page');
      this.selectedStore = this.route.snapshot.paramMap.get('store') == null || this.route.snapshot.paramMap.get('store') == undefined ? '' : this.route.snapshot.paramMap.get('store');
      this.selectedCategory = (this.route.snapshot.paramMap.get('catName') == null || this.route.snapshot.paramMap.get('catName') == undefined) ? '' : this.route.snapshot.paramMap.get('catName');
      this.searchQuery = encodeURIComponent(this.route.snapshot.paramMap.get('qry'));
      this.loadProductResult(this.searchQuery);
    });
  }

  ngOnInit(): void {
  }

  loadProductResult(searchQuery: string) {
    this.getProdSrh(searchQuery);
    this.getMoreOption(searchQuery); // getAutoCompletionProduct values

    // let data = this.storageService.getLocalStorage('compareData');
    // if (data != null) {
    //   this.searchResult.push(data);

    //   setTimeout(() => {
    //     this.storageService.setLocalStorage('compareData', null);
    //   }, 1000);
    // }
  }

  async getProdSrh(qry: any) {
    this.searchResult = [];
    this.similarProducts = [];
    this.moreProducts = [];
    this.productData = [];
    let flag = false;
    this.searchService.getExistingProduct(qry).subscribe(
      res => {
        this.productData = res;
        if (this.productData.length > 0) {
          //console.log(this.productData);
          flag = this.productData[0].isPopular;

          this.productData.forEach(async element => {
            //  if (element.siteName === 'Amazon' && element.groupNo === 1 && element.orderNo === 1) {
            // if (element.siteName === 'Amazon' && element.groupNo === 1) { //changed on 26-11
            if ((element.siteName === 'Amazon' || element.siteName === 'Flipkart') && element.groupNo === 1) {
              if (this.priceRange === 0) {
                this.priceRange = element.price;
                this.SetPriceRange();
              }
            }
            if (flag) {
              this.priceRange = 0;
            }
            await this.SplitData(element);
          });
        } else {
          if (this.currentGroupId === 0) {
            this.searchService.getDefaultSiteByCategory(this.cateId).subscribe(res1 => {
              let siteData: any = res1;
              if (this.cateId === '0') {
                this.sites = siteData;
                this.defaultSite = this.sites;
                this.GetAmazonGroup();
              }
              else {
                this.ChangeCat(this.cateId);
              }
              this.ArrangeData(this.sites, true);
            }, err => { console.log(err); });
          }
          else {
            this.ArrangeData(this.catSites, true);
          }
        }
      }, err => {
        if (this.currentGroupId === 0) {
          this.searchService.getDefaultSiteByCategory('0').subscribe(res => {
            let data: any = res;
            this.sites = data;
            this.defaultSite = this.sites;
            this.GetAmazonGroup();
          }, err1 => { console.log('getProdSrh error1 - ' + err1); });
        }
        else {
          this.ArrangeData(this.catSites, true);
        }
      });
  }

  getMoreOption(keyword: string): void {
    this.searchService.getamazonSuggestionsOnSearch(keyword).subscribe(
      res => {
        this.moreOptions = res;
        this.moreOptions = this.moreOptions[1];
      },
      err => { this.pgMsg = { msg: err.error, alert: "alert-danger" }; }
    );
  }


  ChangeCat(id) {
    this.searchService.getDefaultSiteByCategory(id).subscribe(
      res => {
        // this.loadBool = true;
        this.searchResult = [];
        this.similarProducts = [];
        let data: any = res;
        this.catSites = data;
        this.currentGroupId = id;
        let isAmazonFound = false;
        this.catSites.forEach(site => {
          this.parentSiteName1 = site.ParentSiteName1;
          this.parentSiteName2 = site.ParentSiteName2;
        });
        this.ArrangeData(this.catSites, true);
      }
    );
  }

  SetPriceRange() {
    for (let i = 0; i < this.rangeArr.length - 1; i++) {
      if (this.priceRange >= this.rangeArr[i] && this.priceRange < this.rangeArr[i + 1]) {
        this.lowRange = this.rangeArr[i];
        this.highRange = this.rangeArr[i + 1];
      }
    }
  }

  async SplitData(element) {
    if (element.price > 0) {
      if (!element.imgSrc) {
        element.imgSrc = '../assets/images/blank.png';
      }
      if (element.groupNo === 1 && this.isNotExist(this.searchResult, element)) {
        //console.log(element)
        this.searchResult.push({
          'siteID': element.siteId,
          'siteName': element.siteName,
          'siteLogo': element.siteLogo,
          'productName': element.productName,
          'price': element.price,
          'imgSrc': element.imgSrc,
          'href': element.href,
          'orderNo': element.orderNo,
          'highlight': 0,
          'relevanceNo': element.relevanceNo,
          'groupNo': element.groupNo,
          'siteImg': 'https://pct.azureedge.net/assets/images/' + element.siteName + '.png',
          'transctionId': element.transctionId,
          'offerTitle': element.offerTitle,
          'productNumber': element.productNumber
        });
      } else if (element.groupNo === 2 && element.relevanceNo > 0) {
        //this.isNotExist(this.similarProducts, element) && //commented on 26-11
        this.moreItemFound = true;
        this.similarProducts.push({
          'siteID': element.siteId,
          'siteName': element.siteName,
          'productName': element.productName,
          'siteLogo': element.siteLogo,
          'price': element.price,
          'imgSrc': element.imgSrc,
          'href': element.href,
          'orderNo': element.orderNo,
          'highlight': 0,
          'relevanceNo': element.relevanceNo,
          'groupNo': element.groupNo,
          'siteImg': 'https://pct.azureedge.net/assets/images/' + element.siteName + '.png',
          'transctionId': element.transctionId,
          'offerTitle': element.offerTitle,
          'productNumber': element.productNumber
        });
      }
      //added below if on 26-11
      if (this.priceRange > 0) {
        this.similarProducts = (this.FilterPriceRange(this.similarProducts));
      }
      if (element.groupNo === 3 && element.relevanceNo > 0) {
        this.moreProducts.push({
          'siteID': element.siteId,
          'siteName': element.siteName,
          'productName': element.productName,
          'price': element.price,
          'siteLogo': element.siteLogo,
          'imgSrc': element.imgSrc,
          'href': element.href,
          'orderNo': element.orderNo,
          'highlight': 0,
          'relevanceNo': element.relevanceNo,
          'groupNo': element.groupNo,
          'siteImg': 'https://pct.azureedge.net/assets/images/' + element.siteName + '.png',
          'transctionId': element.transctionId,
          'offerTitle': element.offerTitle,
          'productNumber': element.productNumber
        });
        this.moreProducts = this.RemoveDuplicateProductName(this.moreProducts);
      }
      //price range only when amazon is selected 
      //if (this.selectedStore == 'Amazon' || (this.selectedStore == "" || this.selectedStore == null || this.selectedStore == undefined)) {
      if (this.priceRange > 0 && this.cateId !== '26') { //other than medicine
        this.searchResult = (this.FilterPriceRange(this.searchResult));
        this.similarProducts = (this.FilterPriceRange(this.similarProducts));
        if (this.similarProducts.length === 0) {
          this.moreItemFound = false;
        }
        //console.log(this.searchResult)
      }
      //}
      if (this.searchResult.length > 0) {
        this.noProducts = false;
      } else {
        this.noProducts = true;
      }
    }
  }

  isNotExist(arr, element) {
    if (this.priceRange == 0) {
      return true
    } else {
      for (let i = 0, l = arr.length; i < l; i++) {
        if (arr[i].siteName === element.siteName) {
          return false;
        }
      }
      return true;
    }
  }

  RemoveDuplicateProductName(arr) {
    let uniques = [];
    if (arr === null) {
      return uniques;
    } else {
      let itemsFound = {};
      for (let i = 0, l = arr.length; i < l; i++) {
        let stringified = JSON.stringify({ 'ProductName': arr[i].productName });
        if (itemsFound[stringified]) { continue; }
        uniques.push(arr[i]);
        itemsFound[stringified] = true;
      }
      return uniques;
    }
  }

  FilterPriceRange(arr) {
    let filteredArr = [];
    let rangePercent = 0.4;
    for (let i = 0; i < this.rangeArr.length - 1; i++) {
      if (this.priceRange >= this.rangeArr[i] && this.priceRange < this.rangeArr[i + 1]) {
        this.lowRange = this.rangeArr[i];
        this.highRange = this.rangeArr[i + 1];
      }
    }
    for (let i = 0; i < arr.length; i++) {

      //if ((this.lowRange <= arr[i].price && this.highRange > arr[i].price) || (arr[i].siteName == 'Amazon') || (arr[i].siteName == 'Flipkart')) 
      if ((this.lowRange <= arr[i].price && this.highRange > arr[i].price) ||
        (arr[i].groupNo === 1 && (arr[i].siteName == 'Amazon' || arr[i].siteName == 'Flipkart'))) {
        filteredArr.push(arr[i]);
      }
    }
    return filteredArr;
  }

  getGuid() {
    var date = new Date();
    var components = [
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    ];
    return components.join("");
  }

  GetAmazonGroup() {
    this.searchService.getproductSearchResult('Amazon', this.searchQuery, this.getGuid(), this.getGroupName('Amazon')).subscribe(
      res => {
        let data: any = res;
        if (data != null) {
          if (data.length > 0) {
            data.forEach((element, index) => {
              if (element.siteName === 'Amazon' && element.groupNo === 1 && element.orderNo === 1) {
                //added on 29-08-2020 extra if condition
                if (this.selectedStore == "" || this.selectedStore == "Amazon") {
                  this.priceRange = element.price;
                  this.SetPriceRange();
                }
                // if (this.priceRange === 0) {
                //   this.priceRange = element.price;
                //   this.SetPriceRange();
                // }
                this.SplitData(element);
                this.RemoveSite('Amazon');
                if (this.currentGroupId === 0) {
                  this.productGroup = element.productGroup;
                  this.searchService.getSiteByGroupName(element.productGroup).subscribe(
                    res2 => {
                      if (res2.length > 0) {
                        let groupdata: any = res2;
                        this.otherSites = groupdata;
                        this.ArrangeData(this.otherSites, false);
                      }
                    },
                    err => { console.log(err); }
                  );
                } else {
                  //this.ArrangeData(this.catSites, false);
                }
              }
            });
          }
        }
      },
      err => {
        //console.log(err);
      }
    );
  }

  RemoveSite(siteName) {
    const index = this.sites.indexOf(siteName);
    if (index > -1) {
      this.sites.splice(index, 1);
    }
  }

  getGroupName(site: string) {
    if (this.selectedStore.toUpperCase() == site.toUpperCase()) {
      if (this.selectedGroup == "3") {
        return 'searchGroup';
      }
      else if (this.selectedGroup == "2") {
        return this.selectedCategory; //table name
      }
      else if (this.selectedGroup == "1") {
        return 'bestSeller';
      }
    } else {
      return '';
    }
  }

  ArrangeData(sites, selectedCat) {
    sites.forEach(site => {
      this.searchService.getproductSearchResult(site.siteName, this.searchQuery, this.getGuid(), this.getGroupName(site.siteName)).subscribe(
        res1 => {
          if (res1 == null) { res1 = []; }
          let data1: any = res1;
          data1.forEach((element, index) => {
            //added on 29-08-2020
            if (this.selectedStore != "") {
              if ((element.siteName === this.selectedStore) &&
                element.groupNo === 1 && element.orderNo === 1 && selectedCat) {
                this.priceRange = element.price;
                this.SetPriceRange();
              }
            } else {
              if ((element.siteName === this.parentSiteName1 || element.siteName === this.parentSiteName2) &&
                element.groupNo === 1 && element.orderNo === 1 && selectedCat) {
                this.priceRange = element.price;
                this.SetPriceRange();
              }
            }
            // if ((element.siteName === this.parentSiteName1 || element.siteName === this.parentSiteName2) &&
            //   element.groupNo === 1 && element.orderNo === 1 && selectedCat && this.priceRange == 0) {
            //   this.priceRange = element.price;
            //   this.SetPriceRange();
            // }
            this.SplitData(element);
          });
          this.OrderByPrice(this.searchResult);
          this.OrderByRelevanceNo(this.similarProducts);
          //price range only when amazon is selected 

          //  if (this.selectedStore == 'Amazon' || (this.selectedStore == "" || this.selectedStore == null || this.selectedStore == undefined)) {
          if (this.priceRange > 0 && this.cateId !== '26') { //other than medicine
            this.searchResult = (this.FilterPriceRange(this.searchResult));
            this.similarProducts = (this.FilterPriceRange(this.similarProducts));
          }
          // }
          setTimeout(() => {
          }, 1000);
        },
        err => {
          // console.log(err);
        }
      );
    });
    this.similarProducts.shift();
  }

  OrderByPrice(arr) {
    arr.sort((a, b) => {
      if (a.price > b.price) {
        return 1;
      } else if (a.price < b.price) {
        return -1;
      } else {
        return 0;
      }
    });
  }

  OrderByRelevanceNo(arr) {
    arr.sort((a, b) => {
      if (a.relevanceNo > b.relevanceNo) {
        return -1;
      } else if (a.relevanceNo < b.relevanceNo) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  postProductInfo(prod) {
    prod.activate = true;
    setTimeout(() => {
      prod.activate = false;
      prod.toggle = false;
    }, 5000);
    prod.toggle = true;
    setTimeout(() => {
      let isEligibleForCashback = utilities.isAccountTypeA();
      this.onVisible(prod, 'Products', 'Click')
      if (isEligibleForCashback) {
        if (this.authService.isAuthenticated() || this.authService.isGuestUSer()) {
          this.shop(prod);
        } else {
          utilities.addHTMLClass(['login_page']);
          const options = {
            title: 'Product',
            message: 'Verify',
            data: prod,
            cancelText: 'Cancel',
            confirmText: 'Confirm'
          };

          this.dialogService.openLogin(options);
          this.dialogService.loginConfirmed().subscribe(confirmed => {
            if (confirmed) {
              //this.shop(prod);
            }
            utilities.removeHTMLClass(['login_page']);
          });
        }

      } else {
        this.shop(prod);
      }
    }, 4000);
  }

  onVisible(data, type, eventType) {
    //console.log(type, data);

    let arrayObj = new impressionData();
    arrayObj.type = eventType;
    arrayObj.page_name = 'search_result_page';
    arrayObj.section = type;
    arrayObj.type = eventType;
    arrayObj.idType = 'search_product';
    arrayObj.productName = data.productName;
    arrayObj.name = data.productName;
    utilities.saveImpressionDetails(arrayObj);
  }

  getStoreRewardDetails(siteId) {
    this.searchService.getStoreRewardDetails(siteId).subscribe(res => {
      if (res.length > 0) {
        let options = {
          siteName: res[0].siteName,
          sitelogo: res[0].logo,
          siteUrl: res[0].siteUrl,
          siteDetails: res[0].advertiserDetails,
          rewardTitle: res[0].offerTitle,
          rewardDescription: res[0].offerDescription,
          rewardTerms: res[0].termsAndConditions,
          offerTitle: '',
          offerDescription: '',
          offerTerms: '',
          cancelText: 'CLOSE',
          confirmText: 'YES, LEAVE PAGE'
        };
        this.dialogService.openTerms(options);
        this.dialogService.termsConfirmed().subscribe(confirmed => {
          if (confirmed) {
          }
        });
      }
    }, err => {
    });
  }

  shop(data) {
    const model = utilities.generateProductInfoObject(data, 'Product', null);
    this.searchService.postProductInfo(model)
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res) {
          //console.log(res);
        }
      }, err => {
      });
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
