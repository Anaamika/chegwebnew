import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { OffersDataProviderService } from '@core/services/offers-data-provider.service';

import { OffersData } from '@shared/models/offers-data';
import { utilities } from '@utilities/utilities';

import { plainToClass } from "class-transformer";
import { StoresDataProviderService } from '@app/core/services/stores-data-provider.service';
import { SearchService } from '@app/core/services/search.service';
import { AuthService } from '@core/services/auth.service';
import { DialogService } from '@core/services/dialog.service';
import { AppConstants } from '@app/config/app-constants';

import { MatSnackBar } from '@angular/material/snack-bar';
import { TitleService } from '@app/core/services/title.service';
import { impressionData } from '@app/shared/models/impression-data';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit, OnDestroy {

  @ViewChild('filterBlock') filterBlock: ElementRef;

  destroy$: Subject<boolean> = new Subject<boolean>();
  bestdealsData: OffersData[] = [];
  filteredData = [];
  categoriesList = [];
  CategoryFilter = [];
  StoreFilter = [];
  OfferTypeFilter = [];
  filterChanged = false;

  storeLogoUrl: string;
  storeUrl: string;
  storeName: string
  storeId: number;
  flag: number;
  isFav: boolean;
  bank = utilities.getBankName();
  tabStore: string = 'Offers';


  constructor(
    private titleService: TitleService,
    private route: ActivatedRoute,
    private router: Router,
    private offerService: OffersDataProviderService,
    private storeService: StoresDataProviderService,
    private dialogService: DialogService,
    private searchService: SearchService,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {
    this.storeService.storeInfoObservable.pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.storeName = this.storeService.storeName;
      this.storeUrl = this.storeService.storeUrl;
      this.storeLogoUrl = this.storeService.storeLogoUrl;
      this.isFav = this.storeService.isFav;
    });
    router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      this.storeId = +this.route.snapshot.paramMap.get('storeId');
      let url = this.router.url;
      if (url.includes('giftcards')) {
        this.tabStore = 'Gifts';
      } else {
        this.tabStore = 'Offers';
      }
      // let json = this.storeService.allStores;
      // console.log(json)
      // let self = this;
      // for (let item of json) {
      //   if (item.siteID == this.storeId) {
      //     self.isFav = item.isFav;
      //     self.storeLogoUrl = item.logo;
      //     self.storeUrl = item.siteUrl;
      //     self.storeName = item.siteName;
      //     break;
      //   }
      // };
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle("Online shopping, best cashback deals and stores in India");
    this.titleService.updateDescription("Earn cashback and reward points for shopping online from "+this.bank);
  }

  addtoFavorites($event) {
    $event.stopPropagation();
    $event.preventDefault();
    $event.srcElement.classList.add("no-pointer-event");
    let msg;

    if (this.isFav) {
      this.isFav = false;
      this.flag = 0;
      msg = this.storeName + " removed from Favorites";
    } else {
      this.isFav = true;
      this.flag = 1;
      msg = this.storeName + " added to Favorites";
    }
    const model = {
      chegCustomerId: utilities.getChegUID(), //userId
      siteId: this.storeId,
      name: this.storeName,
      flag: this.flag
    }
    this.storeService.postFavouriteStore(model)
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res) {
          this._snackBar.open(msg, '', {
            duration: 2000,
          });
          $event.srcElement.classList.remove("no-pointer-event");
        }
      }, err => {
      });

    let jsonObj = this.storeService.allStores;
    for (var i = 0; i < jsonObj.length; i++) {
      if (jsonObj[i].siteID === this.storeId) {
        jsonObj[i].isFav = this.isFav;
        return;
      }
    }
  }

  postProductInfo($event, storeUrl) {
    $event.stopPropagation();
    $event.preventDefault();
    let data = {};
    data['storeName'] = this.storeName;
    data['storeId'] = this.storeId;
    data['href'] = storeUrl;
    this.onVisible(data, this.storeId, 'site','Click')

    let isEligibleForCashback = utilities.isAccountTypeA();
    if (isEligibleForCashback) {

      if (this.authService.isAuthenticated() || this.authService.isGuestUSer()) {
        this.shop(data);
      } else {
        utilities.addHTMLClass(['login_page']);
        const options = {
          title: 'Store',
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
    const model = utilities.generateProductInfoObject(data, 'Store', null);
    this.searchService.postProductInfo(model).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
      }
    }, err => {
    });
  }
  onVisible(data, id, type,eventType) {
    //console.log(type, data);
    let page = this.router.url =='/'? 'home':this.router.url;
    let pageName = page.indexOf('/')>-1?page.split('/')[1]:page;
    let arrayObj = new impressionData();
    arrayObj.type = eventType;
    arrayObj.page_name = pageName+'_page';
    arrayObj.section = 'Stores';
    arrayObj.id = id;
    arrayObj.idType = 'store';
    arrayObj.merchantName = data.siteName;
    arrayObj.name = data.siteName;
    //console.log(arrayObj)
    utilities.saveImpressionDetails(arrayObj);
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
