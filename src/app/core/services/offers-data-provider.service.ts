import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { OffersData } from '@shared/models/offers-data';
import { plainToClass } from "class-transformer";
import { AppConstants } from '@app/config/app-constants';
import { ApiConstants } from '@config/api-constants';
import { DataService } from '@core/services/data.service';
import { StorageService } from '@core/services/storage.service';
import { utilities } from '@utilities/utilities';

@Injectable({
  providedIn: 'root'
})
export class OffersDataProviderService {

  constructor(
    private dataService: DataService,
    private storageService: StorageService,
  ) { }

  allOffers: OffersData[] = [];
  offers: OffersData[] = [];

  public getAllOffers(): Observable<any> {
    if (this.allOffers.length > 0) {
      return of(this.allOffers);
    } else {
      return this.dataService.parseApiCall(
        `${ApiConstants.URL.GET_ALL_OFFERS}bName=${utilities.getBankName()}&userID=${utilities.getChegUID()}`,
        'get',
        '',
        this.storageService.getTokenHeader()
      ).pipe(map((res: OffersData[]) => {
        if (res.length > 0) {
          this.allOffers = plainToClass(OffersData, res);
          return this.allOffers;
        }
      }));
    }
  }

  public getOffersByStore(storeID: number): Observable<any> {
    this.offers = [];
    // if (this.allOffers.length > 0) {
    //   this.allOffers.forEach((item, index,) => {
    //     if (item.siteId == storeID) {
    //       this.offers.push(item);
    //     }
    //   })
    //   return of(this.offers);
    // }
    // else {
    return this.dataService.parseApiCall(`${ApiConstants.URL.GET_ALL_STORE_OFFERS}bName=${utilities.getBankName()}&userID=${utilities.getChegUID()}&storeId=${storeID}`,
      'get',
      '',
      this.storageService.getTokenHeader()).pipe(map((res: OffersData[]) => {
        if (res.length > 0) {
          this.offers = plainToClass(OffersData, res);
          return this.offers;
        }
      }, err => {
      }));
    //}
  }

  public getOffersByCategory(catID: number): Observable<any> {
    this.offers = [];
    // if (this.allOffers.length > 0) {
    //   this.allOffers.forEach((item, index,) => {
    //     if (item.categoryId == catID) {
    //       this.offers.push(item);
    //     }
    //   })
    //   return of(this.offers);
    // }
    // else {
    return this.dataService.parseApiCall(`${ApiConstants.URL.GET_ALL_CATEGORY_OFFERS}bName=${utilities.getBankName()}&userID=${utilities.getChegUID()}&catId=${catID}`,
      'get',
      '',
      this.storageService.getTokenHeader()).pipe(map((res: OffersData[]) => {
        if (res.length > 0) {
          this.offers = plainToClass(OffersData, res);
          return this.offers;
        }
      }, err => {
      }));
    //}
  }

  postFavouriteOffer(data: any) {
    return this.dataService.parseApiCall(
      ApiConstants.URL.POST_FAV_OFFER,
      'post',
      data,
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }
}
