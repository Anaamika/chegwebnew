import { Injectable } from '@angular/core';
import { DataService } from '@core/services/data.service';
import { ApiConstants } from '@config/api-constants';
import { AppConstants } from '@app/config/app-constants';
import { utilities } from '@app/utilities/utilities';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

import { map, takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root'
})
export class StartupService {

  bankName= utilities.getBankName();
  type = utilities.getType();

  /**
   * Save all the configuration data in _StartupData variable. So that you can return this for next call instead of calling API
   */
  private _startupData: Array<object> = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  /**
   * @ignore
   */
  constructor(
    private dataService: DataService,
    private storageService:StorageService,
    private authService:AuthService,
  ) { }

  /**
   * @description
   *
   * This is the method you want to call at bootstrap
   *
   * Important: It should return a Promise
   *
   * @returns a promise
   */
  load(): Promise<any> {
    this._startupData = null;
    let chegId;
    let pNum;

    if (utilities.isCallingBankAPI() || ((utilities.isCanara() || utilities.isPNB()) && utilities.checkVirtualIdSessionId())) {
      chegId = 0;
      pNum = 0;
    } else {
      chegId = utilities.getChegUID() == null ? 0 : utilities.getChegUID();
      pNum = utilities.getMobNumber() == null ? 0 : utilities.getMobNumber();
    }
    if ((utilities.isCanara() || utilities.isPNB()) && utilities.checkVirtualIdSessionId()) {
      if(this.authService.isAuthenticated()){
        if (utilities.checkvirtualIdDiff() || utilities.checksessionIdDiff()) {
          this.storageService.setLocalStorage('type', 'Bank');
          this.logout();
        }
      }
    }
    let bankUID = utilities.getBankID() == null ? 0 : utilities.getBankID();
    let bankName = utilities.getBankName();
    let accessToken = JSON.parse(sessionStorage.getItem('accessToken'));
    if (accessToken === null || chegId === 0) {

      if ((utilities.isCanara() || utilities.isPNB()) && utilities.checkVirtualIdSessionId()){
        let sessionId= utilities.getSessionId() == null? '' :utilities.getSessionId()
        return this.dataService.parseApiCall(
          `${ApiConstants.URL.CHECK_SESSION_ID_VALID}virtualId=${bankUID}&SessionId=${sessionId}&UserId=${chegId}&bName=${bankName}&deviceType=${AppConstants.DEVICE_TYPE.NAME}`,
          'get',
          '',
          ApiConstants.COMMON_HEADER
        ).pipe(map((res: Response) => res))
          .toPromise()
          .then((data: any) => this._startupData = data)
          .catch((err: any) => Promise.resolve());
      }else{
        return this.dataService.parseApiCall(
          `${ApiConstants.URL.GET_USER_INFO}UserId=${chegId}&bName=${bankName}&loginId=${bankUID}&pNum=${pNum}&deviceType=${AppConstants.DEVICE_TYPE.NAME}`,
          'get',
          '',
          ApiConstants.COMMON_HEADER
        ).pipe(map((res: Response) => res))
          .toPromise()
          .then((data: any) => this._startupData = data)
          .catch((err: any) => Promise.resolve());
      }
      
    } else {
      return Promise.resolve()
    }
  }
  public logout() {
    sessionStorage.clear();
    this.storageService.setLocalStorage('mobileNumber', 0);
    this.storageService.setLocalStorage('loggedOut', true);
    this.storageService.removeLocalStorage('userName');
    this.storageService.removeLocalStorage('emailID');
    this.storageService.removeLocalStorage('bankUID');
    this.storageService.removeLocalStorage('encdata');
    this.authService.setUserDetails('', '', '', 0);
    this.authService.getRefreshToken()
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.storageService.setSessionStorage('accessToken', decodeURIComponent(res.result));
        //window.location.reload();
      }, err => {
      });
  }

  /**
   * @ignore
   */
  get startupData(): any {
    return this._startupData;
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
