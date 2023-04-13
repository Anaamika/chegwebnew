import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '@core/services/data.service';
import { StorageService } from '@core/services/storage.service';
import { ApiConstants } from '@config/api-constants';
import { utilities } from '@app/utilities/utilities';

@Injectable({
  providedIn: 'root'
})
export class GiftsService {

  constructor(
    private dataService: DataService,
    private storageService: StorageService,
  ) { }

  allGiftCards = [];
  public giftCardObservable = new Subject<any>();

  public getRazorPayKey(): Observable<any> {
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_RAZOR_PAY_KEY}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  public getAllGiftCards(): Observable<any> {
    let bankName = utilities.getBankName();
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_ALL_GIFT_CARDS}bName=${bankName}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      this.allGiftCards = res;
      this.giftCardObservable.next(this.allGiftCards);
      return this.allGiftCards;
    }));
  }

  public getGiftCardDetail(id: number): Observable<any> {
    let json = this.allGiftCards;
    for (let item of json) {
      if (item.productId == id) {
        return item
      }
    };
  }

  public getGiftCardByID(Id: number): Observable<any> {
    let bankName = utilities.getBankName();
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_GIFT_CARD_BY_ID}productId=${Id}&bName=${bankName}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  public getGiftCardsByID(Id: number, type: string): Observable<any> {
    let bankName = utilities.getBankName();
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_GIFT_CARDS_BY_ID}bName=${bankName}&id=${Id}&type=${type}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  public getGiftCardCategories(): Observable<any> {
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_GIFT_CARD_CATEGORIES}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  public getGiftCardRetailers(): Observable<any> {
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_GIFT_CARD_RETAILERS}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  public postGiftCardOrder(data: any) {
    return this.dataService.parseApiCall(
      ApiConstants.URL.POST_GIFT_CARD_ORDER,
      'post',
      data,
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  public getRazorPayOrderId(data: any) {
    return this.dataService.parseApiCall(
      ApiConstants.URL.POST_RAZORPAY_ORDER_ID,
      'post',
      data,
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  public postRazorPaymentDetails(data: any) {
    return this.dataService.parseApiCall(
      ApiConstants.URL.POST_RAZORPAY_PAYMENT_DETAILS,
      'post',
      data,
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
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
