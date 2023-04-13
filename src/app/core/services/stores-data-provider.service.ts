import { Injectable } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConstants } from '@config/api-constants';
import { DataService } from '@core/services/data.service';
import { StorageService } from '@core/services/storage.service';

import { StoresData } from '@shared/models/stores-data'
//import { plainToClass } from "class-transformer";
import { utilities } from '@utilities/utilities';

@Injectable({
  providedIn: 'root'
})
export class StoresDataProviderService {

  constructor(
    private dataService: DataService,
    private storageService: StorageService
  ) { }

  allStores: StoresData[] = [];
  topStores: StoresData[] = [];
  contestStores: StoresData[] = [];
  storeName: string = '';
  storeUrl: string = '';
  storeLogoUrl: string = '';
  isFav: boolean;

  public storesObservable = new Subject<any>();
  public contestStoresObservable =  new Subject<any>();

  public getallStores(): Observable<any> {
    if (this.allStores.length > 0) {
      return of(this.allStores);
    } else {
      return this.dataService.parseApiCall(
        `${ApiConstants.URL.GET_STORES}UserId=${utilities.getChegUID()}&bName=${utilities.getBankName()}`,
        'get',
        '',
        this.storageService.getTokenHeader()
      ).pipe(map((res: StoresData[]) => {
        if (res.length > 0) {
          //console.log(res)
          //this.allStores = plainToClass(StoresData, res);
          this.allStores = res;
          this.storesObservable.next(this.allStores);
          return this.allStores;
        }
      }));
    }
  }

  public getTopStores(): Observable<any> {
    if (this.topStores.length > 0) {
      return of(this.topStores);
    } else {
      return this.dataService.parseApiCall(
        `${ApiConstants.URL.GET_TOP_STORES}UserId=${utilities.getChegUID()}&bName=${utilities.getBankName()}`,
        'get',
        '',
        this.storageService.getTokenHeader()
      ).pipe(map((res: StoresData[]) => {
        if (res.length > 0) {
          //console.log(res)
          this.topStores = res;
          return this.topStores;
        }
      }));
    }
  }

  public postFavouriteStore(data: any) {
    return this.dataService.parseApiCall(
      ApiConstants.URL.POST_FAV_STORE,
      'post',
      data,
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  public storeInfoObservable = new Subject<string>();

  setStoreDetails(storeName, storeUrl, storeLogoUrl, isFav) {
    this.storeName = storeName;
    this.storeUrl = storeUrl;
    this.storeLogoUrl = storeLogoUrl;
    this.isFav = isFav;
    this.storeInfoObservable.next(this.storeLogoUrl);
  }

  public getStoreInfo(storeId) {
    let jsonObj = this.allStores;
    for (var i = 0; i < jsonObj.length; i++) {
      if (jsonObj[i].siteID === storeId) {
        return jsonObj[i];
      }
    }
  }
  public getContestStores(): Observable<any> {
    if (this.contestStores.length > 0) {
      return of(this.contestStores);
    } else {
      return this.dataService.parseApiCall(
        `${ApiConstants.URL.GET_CONTEST_STORES}UserId=${utilities.getChegUID()}&bName=${utilities.getBankName()}`,
        'get',
        '',
        this.storageService.getTokenHeader()
      ).pipe(map((res: StoresData[]) => {
        if (res.length > 0) {
          //console.log(res)
          //this.allStores = plainToClass(StoresData, res);
          this.contestStores = res;
          this.contestStoresObservable.next(this.contestStores);
          return this.contestStores;
        }
      }));
    }
  }

}
