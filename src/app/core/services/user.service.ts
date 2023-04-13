import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '@core/services/data.service';
import { StorageService } from '@core/services/storage.service';
import { ApiConstants } from '@config/api-constants';
import { utilities } from '@app/utilities/utilities';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private dataService: DataService,
    private storageService: StorageService
  ) { }

  // rewardsAwarded: number = 0;
  userData: Array<object> = [];
  awardsList: string[] = [];

  public walletObservable = new Subject<number>();

  updatedWalletbalance() {
    this.walletObservable.next();
  }

  public getRedeemBalance(): Observable<any> {
    let chegId = utilities.getChegUID() == null ? 0 : utilities.getChegUID();
    let bankName = utilities.getBankName();
    return this.dataService
      .parseApiCall(
        `${ApiConstants.URL.GET_USER_REDEEM_POINTS}userId=${chegId}&bName=${bankName}`,
        'get',
        '',
        this.storageService.getTokenHeader()
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public getShoppingTrips(): Observable<any> {
    let chegId = utilities.getChegUID() == null ? 0 : utilities.getChegUID();
    let bankName = utilities.getBankName();
    return this.dataService
      .parseApiCall(
        `${ApiConstants.URL.GET_USER_SHOPPING_TRIPS}userId=${chegId}&bName=${bankName}`,
        'get',
        '',
        this.storageService.getTokenHeader()
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public getPaymentDetails(): Observable<any> {
    let chegId = utilities.getChegUID() == null ? 0 : utilities.getChegUID();
    let bankName = utilities.getBankName();
    return this.dataService
      .parseApiCall(
        `${ApiConstants.URL.GET_USER_PAYMENT_DETAILS}userId=${chegId}&bName=${bankName}`,
        'get',
        '',
        this.storageService.getTokenHeader()
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public withdrawAmmount(data: any): Observable<any> {
    return this.dataService
      .parseApiCall(
        ApiConstants.URL.POST_WITHDRAWAL_REQUEST,
        'post',
        data,
        this.storageService.getTokenHeader()
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public getMyOrders(): Observable<any> {
    let chegId = utilities.getChegUID() == null ? 0 : utilities.getChegUID();
    let bankName = utilities.getBankName();
    return this.dataService
      .parseApiCall(
        `${ApiConstants.URL.GET_GIFT_CARD_ORDERS}ChegCustomerId=${chegId}&bName=${bankName}`,
        'get',
        '',
        this.storageService.getTokenHeader()
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public getOrderDetailsByID(id: number): Observable<any> {
    return this.dataService
      .parseApiCall(
        `${ApiConstants.URL.GET_GIFT_CARD_ORDER_BY_ID}Id=${id}`,
        'get',
        '',
        this.storageService.getTokenHeader()
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public getUsersByEmailID(data: any): Observable<any> {
    return this.dataService
      .parseApiCall(
        `${ApiConstants.URL.GET_ALL_USERS_BY_EMAIL}`,
        'post',
        data,
        this.storageService.getTokenHeader()
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public submitEmployeeRewards(data: any): Observable<any> {
    return this.dataService
      .parseApiCall(
        `${ApiConstants.URL.POST_EMP_REWARDS}`,
        'post',
        data,
        this.storageService.getTokenHeader()
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public getCorpAwards(): Observable<any> {
    let bankName = utilities.getBankName();
    return this.dataService
      .parseApiCall(
        `${ApiConstants.URL.GET_CORP_AWARDS}corpName=${bankName}`,
        'get',
        '',
        this.storageService.getTokenHeader()
      )
      .pipe(
        map((res) => {
          this.awardsList = res;
          return res;
        })
      );
  }

  public corpAwardsIUD(data: any): Observable<any> {
    return this.dataService
      .parseApiCall(
        `${ApiConstants.URL.POST_IUD_AWARDS}`,
        'post',
        data,
        this.storageService.getTokenHeader()
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public getCorpLedger(): Observable<any> {
    let bankName = utilities.getBankName();
    return this.dataService
      .parseApiCall(
        `${ApiConstants.URL.GET_CORP_LEDGER}Corpname=${bankName}`,
        'get',
        '',
        this.storageService.getTokenHeader()
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public getCorpUserLedger(): Observable<any> {
    let bankName = utilities.getBankName();
    return this.dataService
      .parseApiCall(
        `${ApiConstants.URL.GET_CORP_USER_LEDGER}Corpname=${bankName}`,
        'get',
        '',
        this.storageService.getTokenHeader()
      )
      .pipe(
        map((res) => {
          //console.log(res)
          // let data = res.sort((a, b) => {
          //   let da: any = new Date(a.ledgerDate);
          //   let db: any = new Date(b.ledgerDate);
          //   return db - da;
          // });
          // let debit = 0;
          // for (let i = 0; i < res.length; i++) {
          //   debit = debit + res[i]['debit'];
          // }
          // this.rewardsAwarded = debit;
          return res;
        })
      );
  }

  public getCorpGiftCardDetails(): Observable<any> {
    let bankName = utilities.getBankName();
    return this.dataService
      .parseApiCall(
        `${ApiConstants.URL.GET_CORP_GIFT_DETAILS}corpName=${bankName}`,
        'get',
        '',
        this.storageService.getTokenHeader()
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public getCorpRewardDetails(): Observable<any> {
    let bankName = utilities.getBankName();
    return this.dataService
      .parseApiCall(
        `${ApiConstants.URL.GET_CORP_REWARD_DETAILS}corpName=${bankName}`,
        'get',
        '',
        this.storageService.getTokenHeader()
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  public getAllUserData(): Observable<any> {
    let bankName = utilities.getBankName();

    if (this.userData.length > 0) {
      return of(this.userData);
    } else {
      return this.dataService
        .parseApiCall(
          `${ApiConstants.URL.GET_ALL_USERS_DATA}corpName=${bankName}`,
          'get',
          '',
          this.storageService.getTokenHeader()
        )
        .pipe(
          map((res) => {
            this.userData = res;
            return res;
          })
        );
    }
  }

  public receiveMail(data: any) {
    return this.dataService.parseApiCall(
      ApiConstants.URL.SEND_EMAIL_BFSL,
      'post',
      data,
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }
}
