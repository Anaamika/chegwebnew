import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject, fromEvent } from 'rxjs';

import { ApiConstants } from '@config/api-constants';
import { DataService } from '@core/services/data.service';
import { StorageService } from '@core/services/storage.service';
import { CategoriesDataProviderService } from '@core/services/categories-data-provider.service';
import { StoresDataProviderService } from '@core/services/stores-data-provider.service';

import { GetBannerData } from '@shared/models/get-banner-data'
import { CategoriesData } from '@shared/models/categories-data'
import { StoresData } from '@shared/models/stores-data'
import { BestSellersData } from '@shared/models/best-sellers-data'
import { BestDealsData } from '@shared/models/best-deals-data'

import { bannerMockData } from '@shared/mock/home-banner-data'
import { categoriesMockData } from '@shared/mock/categories-carousel-data'
import { storesMockData } from '@shared/mock/stores-carousel-data'
import { plainToClass } from "class-transformer";//library to map Jsonobject to Class(model)
import { utilities } from '@utilities/utilities';
import { TitleService } from '@app/core/services/title.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  offersData: GetBannerData[] = bannerMockData;
  homeBannersData: Array<object> = [];
  categoriesData: CategoriesData[] = categoriesMockData;
  storesData: StoresData[] = storesMockData;
  bestsellersData: BestSellersData[] = [];
  bestdealsData: BestDealsData[] = [];
  bestOffersData: Array<object> = [];
  bestOffersPopular: Array<object> = [];
  featuredCatData: Array<object> = [];
  topGiftCardsData: Array<object> = [];
  popularTagsData = [];
  @ViewChild('CatCarouselWrapper', { static: true }) CatCarouselWrapper: ElementRef;
  @ViewChild('StoreCarouselWrapper', { static: true }) StoreCarouselWrapper: ElementRef;
  @ViewChild('bannerCarouselWrapper', { static: true }) bannerCarouselWrapper: ElementRef;
  //@ViewChild('OffCarouselWrapper', { static: true }) OffCarouselWrapper: ElementRef;
  @ViewChild('Banner', { static: true }) Banner: ElementRef;
  @ViewChild('Container', { static: true }) Container: ElementRef;

  mLeft: number;
  bank = utilities.getBankName();
  isBandhan:boolean = this.bank =='BANDHAN'?true:false;
  CatCarouselWrapper_Width;
  StoreCarouselWrapper_Width;
  bannerCarouselWrapper_Width
  //offerCarouselWrapper_Width;
  isBank: boolean = false;

  constructor(
    private titleService: TitleService,
    private dataService: DataService,
    private storageService: StorageService,
    private categoryService: CategoriesDataProviderService,
    private storeService: StoresDataProviderService,
  ) {
    fromEvent(window, 'resize').subscribe((e: any) => {
      if (this.Container) {
        if (e.target.innerWidth > 1365) {
          this.mLeft = this.Container.nativeElement.offsetLeft;
        }
      }
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle("Compare prices, get best deals, cashback offers and coupons");
    this.titleService.updateDescription("Shop and save more with " + this.bank + ". Get latest coupon codes and offers, compare prices, earn cashbacks from Amazon, Myntra, AJIO, PharmEasy, TataCliQ and many more.");
    if (window.innerWidth > 1365) {
      if (this.Container) {
        this.mLeft = this.Container.nativeElement.offsetLeft;
      }
    }
    let type = utilities.getType();
    if (type === 'Bank') {
      this.isBank = true;
    } else {
      this.isBank = false;
    }
    this.CatCarouselWrapper_Width = this.CatCarouselWrapper.nativeElement.offsetWidth - 30;
    this.StoreCarouselWrapper_Width = this.StoreCarouselWrapper.nativeElement.offsetWidth - 30;
    if(this.bannerCarouselWrapper){
      this.bannerCarouselWrapper_Width = this.bannerCarouselWrapper.nativeElement.offsetWidth - 30;
    }
    //this.offerCarouselWrapper_Width = this.OffCarouselWrapper.nativeElement.offsetWidth;
    this.popularTagsData = [{ "keyword": "redmi9" }, { "keyword": "iphone 12 128gb" }, { "keyword": "mamaearth onion oil" }, { "keyword": "fastrack reflex 2.0" }, { "keyword": "Harry Potter Complete Collection" }, { "keyword": "idli maker" }, { "keyword": "OnePlus Buds" }, { "keyword": " Bravia 32inches HD LED TV" }, { "keyword": " laptop mouse" }, { "keyword": "anti skid shoes" }]

    this.getBannerData();
    this.getPopularTags();
    this.getTopStores();
    this.getTopCategories();

    this.getTopGiftCards();
    this.getFeaturedCategories();
    //this.getBestSellers();
    this.getBestDeals();

    setTimeout(() => {
      if (this.Banner) {
        let slideNav = this.Banner.nativeElement.querySelectorAll('.slide-nav');
        let self = this;
        if (slideNav !== null) {
          for (let i = 0; i < slideNav.length; i++) {
            slideNav[i].addEventListener('click', function (event) {
              event.preventDefault();
              // get current slide
              let current = self.Banner.nativeElement.querySelector('.flex--active').getAttribute('data-slide'),
                // get button data-slide
                next = this.getAttribute('data-slide');

              if (this.nextElementSibling) {
                this.nextElementSibling.classList.remove('active');
              }
              if (this.previousElementSibling) {
                this.previousElementSibling.classList.remove('active');
              }

              this.classList.add('active');

              if (current === next) {
                return false;
              } else {
                let sliderWrapper = self.Banner.nativeElement.querySelector('.slider__wrapper');
                sliderWrapper.querySelector('.flex__container[data-slide="' + next + '"]').classList.add('flex--preStart');
                self.Banner.nativeElement.querySelector('.flex--active').classList.add('animate--end');
                setTimeout(function () {
                  self.Banner.nativeElement.querySelector('.flex--preStart').classList.add('flex--active');
                  self.Banner.nativeElement.querySelector('.flex--preStart').classList.remove('animate--start');
                  self.Banner.nativeElement.querySelector('.flex--preStart').classList.remove('flex--preStart');

                  self.Banner.nativeElement.querySelector('.animate--end').classList.add('animate--start');
                  self.Banner.nativeElement.querySelector('.animate--end').classList.remove('flex--active');
                  self.Banner.nativeElement.querySelector('.animate--end').classList.remove('animate--end');
                }, 800);
              }
            });
          }
        }
      }
    }, 200);
  }

  private getBannerData() {
    this.dataService.parseApiCall(`${ApiConstants.URL.GET_BANNER_DATA}bankName=${utilities.getBankName()}`,
      'get',
      '',
      this.storageService.getTokenHeader()).pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res.length > 0) {
          let filter = {};
          filter['location'] = 'Home';
          this.homeBannersData = utilities.arrayObjectMultiFilter(res, filter);
          console.log(this.homeBannersData,'this.homeBannersData');
        }
      }, err => {
      });
  }

  private getPopularTags() {
    this.dataService.parseApiCall(`${ApiConstants.URL.GET_POPULAR_SEARCH_KEYWORDS}`,
      'get',
      '',
      this.storageService.getTokenHeader()).pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res.length > 0) {
          //console.log(JSON.stringify(res))
          this.popularTagsData = res.slice(0, 10);
        }
      }, err => {
      });
  }

  private getTopGiftCards() {
    let bankName = utilities.getBankName();
    this.dataService.parseApiCall(`${ApiConstants.URL.GET_TOP_GIFT_CARDS}bName=${bankName}`,
      'get',
      '',
      this.storageService.getTokenHeader()).pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res.length > 0) {
          //console.log(res)
          this.topGiftCardsData = res;
        }
      }, err => {
      });
  }

  private getFeaturedCategories() {
    this.categoryService.getFeaturedCategories().pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.length > 0) {
        this.featuredCatData = res;
      }
    }, err => {
    });
  }

  private getTopCategories() {
    this.categoryService.getTopCategories().pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.length > 0) {
        this.categoriesData = res;
      }
    }, err => {
    });
  }

  private getTopStores() {
    this.storeService.getTopStores().pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.length > 0) {
        this.storesData = res;
      }
    }, err => {
    });
  }

  private getBestSellers() {
    this.dataService.parseApiCall(`${ApiConstants.URL.GET_TOP_PRODUCTS}`,
      'get',
      '',
      this.storageService.getTokenHeader()).pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res) {
          //console.log(res)
          this.bestsellersData = res;
        }
      }, err => {
      });
  }

  private getBestDeals() {
    this.dataService.parseApiCall(`${ApiConstants.URL.GET_TOP_DEALS}UserId=${utilities.getChegUID()}&bName=${utilities.getBankName()}`,
      'get',
      '',
      this.storageService.getTokenHeader()).pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res) {
          this.bestdealsData = res;
          this.bestOffersPopular = res[0].offers;
          this.bestOffersData = this.bestOffersPopular;
          //console.log(this.bestOffersPopular)
        }
      }, err => {
      });
  }

  toggleBestDeals(event) {
    let catID = +event.srcElement.value
    if (catID === 101) {
      this.bestOffersData = this.bestOffersPopular;
    } else {
      this.dataService.parseApiCall(`${ApiConstants.URL.GET_TOP_DEALS_BY_CATID}categoryID=${catID}&UserId=${utilities.getChegUID()}&bName=${utilities.getBankName()}`,
        'get',
        '',
        this.storageService.getTokenHeader()).pipe(takeUntil(this.destroy$)).subscribe(res => {
          if (res) {
            //console.log(res)
            this.bestOffersData = res;
          }
        }, err => {
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
