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
export class ContestService {

  constructor(  private dataService: DataService,
    private storageService: StorageService) { }
    contestStores: StoresData[] = [];

    public storesObservable = new Subject<any>();

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
            this.storesObservable.next(this.contestStores);
            return this.contestStores;
          }
        }));
      }
    }

    public getContestStoresTest(): Observable<any> {
      return this.dataService.parseApiCall(
        `${ApiConstants.URL.GET_CONTEST_STORES}`,
        'get',
        '',
        this.storageService.getTokenHeader()
      ).pipe(map(res => {
        return res;
      }));
    }
}
