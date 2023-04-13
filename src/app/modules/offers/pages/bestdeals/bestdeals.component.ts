import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject, from } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { OffersData } from '@shared/models/offers-data';
import { utilities } from '@utilities/utilities';
import { bestDealsMockData } from '@shared/mock/best-deals-data';

import { BreakpointObserver } from '@angular/cdk/layout'; 

import { OffersDataProviderService } from '@core/services/offers-data-provider.service';
import { StoresDataProviderService } from '@app/core/services/stores-data-provider.service';
import { CategoriesDataProviderService } from '@core/services/categories-data-provider.service';
import { DialogService } from '@core/services/dialog.service';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { gsap, TweenMax, Circ } from "gsap/all";
import { CategoriesData } from '@app/shared/models/categories-data';

gsap.registerPlugin(Circ);

@Component({
  selector: 'app-bestdeals',
  templateUrl: './bestdeals.component.html',
  styleUrls: ['./bestdeals.component.scss']
})
export class BestdealsComponent implements OnInit, OnDestroy {
  @ViewChild('filterBlock') filterBlock: ElementRef;
  destroy$: Subject<boolean> = new Subject<boolean>();
  bestdealsData: OffersData[] = [];
  filteredData = [];
  categoriesList = [];
  storesList = [];
  CategoryFilter = [];
  TopCategoryFilter = [];
  StoreFilter = [];
  OfferTypeFilter = [];
  CardTypeFilter = [];
  DiscountRangeFilter = [];
  mobileView: boolean = false; 
  filterChanged = false;
  filtertopChanged:boolean = false;
  hideCategory: boolean = false;
  hideStore: boolean = false;
  catUID: number;
  noData: boolean = false;
  showError: boolean = false;
  noOffers: boolean = false;
  title: string = '';
  description: string = '';
  rewardTitle: string = '';
  rewardDescription: string = ''
  storeData: any = [];
  private webWorker: Worker
  favcategoriesData: CategoriesData[];

  constructor(
    private offerService: OffersDataProviderService,
    private storeService: StoresDataProviderService,
    private categoryService: CategoriesDataProviderService,
    private dialogService: DialogService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      this.webWorker = new Worker('../../../../shared/webworker/filters.worker', { type: 'module' });
      let url = this.router.url;
      if (url.includes('offers')) {
        this.getAllOffers();
      } else if (url.includes('stores')) {
        this.noData = true;
        this.getAllStoreOffers(+this.route.snapshot.paramMap.get('storeId'));
        this.hideStore = true;
        this.getStoreInfo();
      } else if (url.includes('categories')) {
        this.catUID = +this.route.snapshot.paramMap.get('uid');
        this.categoryService.catUID = +this.route.snapshot.paramMap.get('uid');//storing in service to use in category page(get uid cid etc)
        this.categoryService.catNode = this.route.snapshot.paramMap.get('cid');
        this.categoryService.catTitle = this.route.snapshot.paramMap.get('cname');
        this.setCategoryDetails();
        this.getAllCategoryOffers(+this.route.snapshot.paramMap.get('uid'));
        this.hideCategory = true;
      }
    });
  }

  ngOnInit(): void {
  }

  setCategoryDetails() {
    this.categoryService.setCategoryDetails(this.catUID);
  }

  public getAllOffers() {
    this.offerService.getAllOffers()
      .pipe(takeUntil(this.destroy$)).subscribe((res: OffersData[]) => {
        if (res.length > 0) {
          this.bestdealsData = [];
          this.categoriesList = [];
          this.storesList = [];
          this.bestdealsData = res;
          this.buildData(this.bestdealsData)
          this.buildFilter(this.bestdealsData)
        }
      }, err => {
      });
  }

  checkBrowserWidth() {
    if (this.breakpointObserver.isMatched('(min-width: 1024px)')) {
      this.mobileView = false;
    } else {
      this.mobileView = true;
    }
  }
  
  private buildData(bestdealsData) {
    this.filteredData = [];
    for (let i = 0; i < bestdealsData.length; i++) {
      let item = bestdealsData[i];
      setTimeout(() => {
        this.filteredData.push(item);
      }, 10 * (i + 1));
    }
  }

  private buildFilter(bestdealsData) { //using web worker to handle large data  operations
    if (typeof Worker !== 'undefined') {
      // Create a new
      let self = this;
      this.webWorker.onmessage = function (evt) {
        self.categoriesList = evt.data['category'];
        console.log('self.categoriesList',self.categoriesList);
        self.storesList = evt.data['store'];
        let mcData = self.categoryService.mainCategories;
        if (mcData.length == 0) {
          self.categoryService.categoriesObservable.pipe(takeUntil(self.destroy$)).subscribe(res => {
            let data = self.categoryService.mainCategories;
            self.favcategoriesData = data.slice(0, 5);
          });
        } else {
          self.favcategoriesData = mcData.slice(0, 5);
        }
        self.favcategoriesData.forEach(element => {
          utilities.removeItemOnce(self.categoriesList,element.categoryName);
        });
        self.cd.detectChanges();
      }

      this.webWorker.postMessage(bestdealsData)
    } else {
      // Web workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  private getAllStoreOffers(storeID) {
    this.offerService.getOffersByStore(storeID)
      .pipe(takeUntil(this.destroy$)).subscribe((res: OffersData[]) => {
        if (res!=undefined && res.length > 0) {
          if (res[0].offer == null) {
            this.bestdealsData = [];
            this.bestdealsData = res;
            let stoData = this.storeService.allStores;
            if (stoData.length == 0) {
              this.storeService.storesObservable.pipe(takeUntil(this.destroy$)).subscribe(res => {
                this.setStoreDetails(this.storeService.allStores)
              });
            } else {
              this.setStoreDetails(stoData)
            }
            this.noData = true;
            this.showError = true;
          } else {
            this.noData = false;
            this.bestdealsData = [];
            this.categoriesList = [];
            this.bestdealsData = res;
            this.filteredData = this.bestdealsData;
            //console.log(this.bestdealsData)

            this.bestdealsData.forEach(element => {
              if (element.category != null) {
                let arr = element.category.split(',');
                for (let i = 0; i < arr.length; i++) {
                  this.categoriesList.push(arr[i]);
                }
                //this.categoriesList.push(element.category);
              }
            });
            this.categoriesList = utilities.getUniqueArray(this.categoriesList.sort());
            this.cd.detectChanges();

            let stoData = this.storeService.allStores;
            if (stoData.length == 0) {
              this.storeService.storesObservable.pipe(takeUntil(this.destroy$)).subscribe(res => {
                this.setStoreDetails(this.storeService.allStores)
              });
            } else {
              this.setStoreDetails(stoData)
            }
          }
        }else{
          this.noData = true;
          this.showError = true;
        }
      }, err => {
      });
  }

  private getAllCategoryOffers(catID) {
    this.offerService.getOffersByCategory(catID)
      .pipe(takeUntil(this.destroy$)).subscribe((res: OffersData[]) => {
        if (res) {
          //console.log(res)
          this.bestdealsData = [];
          this.categoriesList = [];
          this.bestdealsData = res;
          this.filteredData = this.bestdealsData;

          this.bestdealsData.forEach(element => {
            if (element.merchantName != null) {
              this.storesList.push(element.merchantName);
            }
          });
          this.storesList = utilities.getUniqueArray(this.storesList.sort());
          this.cd.detectChanges();
        }
      }, err => {
      });
  }

  setStoreDetails(json) {//passing Store URL and other infos to parent banner; because here we get store url with UUID
    let storeLogoUrl = this.bestdealsData[0].merchantLogo;
    let storeUrl = this.bestdealsData[0].merchantUrl;
    let storeName = this.bestdealsData[0].merchantName;

    for (let item of json) {
      if (item.siteID == this.bestdealsData[0].siteId) {
        let isFav = item.isFav;
        if (storeLogoUrl == null) {
          storeLogoUrl = item.logo;
        }
        this.storeService.setStoreDetails(storeName, storeUrl, storeLogoUrl, isFav);
        this.cd.detectChanges();
        break;
      }
    };
  }

  filterOffers() { // not used now

    let cat = this.CategoryFilter;
    let sto = this.StoreFilter;
    let off = this.OfferTypeFilter;
    let result = this.bestdealsData.filter(function (e) {
      if (!utilities.isArrayEmpty(sto) && utilities.isArrayEmpty(cat) && utilities.isArrayEmpty(off)) {
        //console.log('Sto true')
        return sto.includes(e.merchantName);
      } else if (utilities.isArrayEmpty(sto) && !utilities.isArrayEmpty(cat) && utilities.isArrayEmpty(off)) {
        //console.log('Cat true')
        return cat.includes(e.category);
      } else if (utilities.isArrayEmpty(sto) && utilities.isArrayEmpty(cat) && !utilities.isArrayEmpty(off)) {
        //console.log('Offer Type true')
        return off.includes(e.couponType);
      } else if (!utilities.isArrayEmpty(sto) && !utilities.isArrayEmpty(cat) && !utilities.isArrayEmpty(off)) {
        //console.log('All true');
        return cat.includes(e.category) && sto.includes(e.merchantName) && off.includes(e.couponType);
      } else {
        //console.log('none true')
        return e;
      }
    });
    this.filteredData = result;
  }

  receiveFilter($event) {
    //console.log($event)
    let filters = $event;

    this.CategoryFilter = $event.category;
    this.StoreFilter = $event.merchantName;
    this.OfferTypeFilter = $event.couponType;
    this.CardTypeFilter = $event.cardType;
    this.DiscountRangeFilter = $event.discountAmount;

    //console.log(utilities.arrayObjectMultiFilter(this.bestdealsData, filters));
    this.filteredData = utilities.arrayObjectMultiFilter(this.bestdealsData, filters);
    if (this.filteredData.length > 0) {
      this.noOffers = false;
    } else {
      this.noOffers = true;
    }

    this.cd.detectChanges();
  }
  receiveCatFilter($event) {
    let filters = $event;
    this.TopCategoryFilter = $event.category;
    this.filteredData = utilities.arrayObjectMultiFilter(this.bestdealsData, filters);
    if (this.filteredData.length > 0) {
      this.noOffers = false;
    } else {
      this.noOffers = true;
    }

    this.cd.detectChanges();
  }

  removeCat(data) {
    this.filterChanged = false;
    utilities.removeItemOnce(this.CategoryFilter, data);
    this.cd.detectChanges();
    this.filterChanged = true;

  }
  removeTopCat(data){
    this.filtertopChanged = false;
    utilities.removeItemOnce(this.TopCategoryFilter, data);
    this.cd.detectChanges();
    this.filtertopChanged = true;
  }

  removeSto(data) {
    this.filterChanged = false;
    utilities.removeItemOnce(this.StoreFilter, data)
    this.cd.detectChanges();
    this.filterChanged = true;
  }

  removeOff(data) {
    this.filterChanged = false;
    utilities.removeItemOnce(this.OfferTypeFilter, data)
    this.cd.detectChanges();
    this.filterChanged = true;
  }

  removeCard(data) {
    this.filterChanged = false;
    utilities.removeItemOnce(this.CardTypeFilter, data)
    this.cd.detectChanges();
    this.filterChanged = true;
  }

  removeDisc(data) {
    this.filterChanged = false;
    utilities.removeItemOnce(this.DiscountRangeFilter, data)
    this.cd.detectChanges();
    this.filterChanged = true;
  }

  public showFilters($event) {
    $event.preventDefault();
    let elem = this.filterBlock.nativeElement.querySelector('.mobile-filter');
    TweenMax.to(elem, .2, { top: '0', opacity: 1, ease: Circ.easeOut });
  }

  getStoreInfo() {
    let stoData = this.storeService.allStores;
    if (stoData.length == 0) {
      this.storeService.storesObservable.pipe(takeUntil(this.destroy$)).subscribe(res => {
        let arr = this.storeService.getStoreInfo(+this.route.snapshot.paramMap.get('storeId'));
        this.storeData = arr;
        this.title = arr['siteName'];
        this.description = arr['advertiserDetails'];
        this.rewardTitle = arr['offerTitle'];
        this.rewardDescription = arr['offerDescription'];
      })
    } else {
      let arr = this.storeService.getStoreInfo(+this.route.snapshot.paramMap.get('storeId'));
      this.storeData = arr;
      this.title = arr['siteName'];
      this.description = arr['advertiserDetails'];
      this.rewardTitle = arr['offerTitle'];
      this.rewardDescription = arr['offerDescription'];
    }
    // if no offer is present for store...
    if(this.bestdealsData.length == 0){ 
      let storeLogoUrl = this.storeData.logo;
      let storeUrl =  this.storeData.siteUrl;
      let storeName = this.storeData.siteName;
      this.storeService.setStoreDetails(storeName, storeUrl, storeLogoUrl, false);
        this.cd.detectChanges();
    }
  }

  openTermsDialog($event) {
    $event.stopPropagation();
    $event.preventDefault();
    let data = this.storeData;
    let options = {
      siteName: data.siteName,
      sitelogo: data.logo,
      siteUrl: data.siteUrl,
      siteDetails: data.advertiserDetails,
      rewardTitle: data.offerTitle,
      rewardDescription: data.offerDescription,
      rewardTerms: data.termsAndConditions,
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

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
    this.webWorker.terminate()
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
