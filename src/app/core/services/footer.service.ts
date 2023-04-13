import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { StorageService } from '@core/services/storage.service';
import { FooterData } from '@app/shared/models/footer-data';
import { Observable, of, Subject } from 'rxjs';
import { ApiConstants } from '@app/config/api-constants';
import { plainToClass } from 'class-transformer';
import { map } from 'rxjs/operators';
import { utilities } from '@utilities/utilities';


@Injectable({
  providedIn: 'root'
})
export class FooterService {

  constructor(
    private dataService: DataService,
    private storageService: StorageService
  ) { }

  footerdata: FooterData[] = [];
  contactUsQuery: string[] = [];
  contactUsMsg: string = '';

  public contactUsQueryObservable = new Subject<any>();

  public getfooterdeatils(): Observable<any> {
    if (this.footerdata.length > 0) {
      return of(this.footerdata);
    } else {
      return this.dataService.parseApiCall(
        `${ApiConstants.URL.GET_FOOTER_INFO}bName=${utilities.getBankName()}`,
        'get',
        '',
        this.storageService.getTokenHeader()
      ).pipe(map((res: FooterData[]) => {
        if (res.length > 0) {
          this.footerdata = plainToClass(FooterData, res);
          this.contactUsQuery = this.footerdata[0].topicsArray;
          this.contactUsMsg = this.footerdata[0].contactUsMsg;
          this.contactUsQueryObservable.next(this.contactUsQuery);
          return this.footerdata;
        }
      }));
    }
  }

  public getFooterCategoriesForSEO(): Observable<any> {
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_FOOTER_CATEGORIES_FOR_SEO}bName=${utilities.getBankName()}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  public insertImpressionDetails(): Observable<any> {
    const model: any = {
      ip: '',
      userId: utilities.getChegUID() == null ? 0 : utilities.getChegUID(),
      platform: 'WEB',
      publisher_Id: utilities.getBankName(),
      events: utilities.getImpressionDetails(),
      sessionId: this.storageService.getSessionStorage('sessionId')
    };
    console.log('impression', model);
    return this.dataService.parseApiCall(
      ApiConstants.URL.POST_IMPRESSION_DETAILS,
      'post',
      model,
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }
}
