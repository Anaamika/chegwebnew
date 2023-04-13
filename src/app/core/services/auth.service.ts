import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '@core/services/data.service';
import { StorageService } from '@core/services/storage.service';
import { ApiConstants } from '@config/api-constants';
import { utilities } from '@app/utilities/utilities';
import decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userName: string = '';
  mobNumber: string = '';
  emailID: string = '';
  chegUID: string = '';

  isRegistration: string = '';
  isReward: boolean = false;

  count: number = 0; //not used in API, but since we used Cache so updating it to get new result(For Resend OTP and others)

  constructor(
    private dataService: DataService,
    private storageService: StorageService
  ) {
    this.userName = this.storageService.getLocalStorage('userName');
    this.mobNumber = this.storageService.getLocalStorage('mobileNumber');
    this.emailID = this.storageService.getLocalStorage('emailID');
    this.chegUID = this.storageService.getLocalStorage('chegUID');
  }

  public userObservable = new Subject<string>();

  setUserDetails(name, num, email, chegId) {
    if (name != null) {
      this.userName = name;
    }
    if (num != null) {
      this.mobNumber = num;
    }
    if (email != null) {
      this.emailID = email;
    }
    if (chegId) {
      this.chegUID = chegId;
    }
    this.userObservable.next();
  }

  public isAuthenticated(): boolean {
    if ((this.userName !== '' && this.userName && this.userName !== '_Guest_User_') || utilities.isPNB()) {
      if (utilities.isCallingBankAPI() || ((utilities.isCanara() || utilities.isPNB()) && utilities.checkVirtualIdSessionId())) {
        let sessionUsr = this.storageService.getSessionStorage('userName');

        if ((sessionUsr && sessionUsr !== '') || utilities.isPNB()) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  public isHR(expectedRole: number): boolean {
    if (utilities.getType().toLowerCase() == 'corp' || utilities.getBankName().toLowerCase() == 'bfsl' ) {
      const token = this.storageService.getSessionStorage('accessToken');
      const tokenPayload = decode(token);
      console.log('isHR before parse');
      const role = JSON.parse(tokenPayload['UserRole']);
      console.log('isHR after parse '  );
      if (role.some(item => item.RoleId === expectedRole)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  public isLoggedIn(): boolean {
    const token = this.storageService.getSessionStorage('accessToken');
    const tokenPayload = decode(token);
    const chegID = JSON.parse(tokenPayload['ChegCustomerId']);
    if ((this.userName && this.userName !== '' && this.userName !== '_Guest_User_' && chegID == this.chegUID) || utilities.isPNB()) {
      if (utilities.isCallingBankAPI() || ((utilities.isCanara() || utilities.isPNB()) && utilities.checkVirtualIdSessionId())) {
        let sessionUsr = this.storageService.getSessionStorage('userName');
        if ((sessionUsr && sessionUsr !== '') || utilities.isPNB()) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  public isActiveSession(): boolean {
    return this.storageService.getLocalStorage('loggedOut');
  }

  public isGuestUSer(): boolean {
    if (this.userName === '_Guest_User_') {
      return true;
    } else {
      return false;
    }
  }

  public getRefreshToken(): Observable<any> {
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_REFRESH_TOKEN
      }ChegCustomerId=${utilities.getChegUID()}`,
      'get',
      '',
      ApiConstants.COMMON_HEADER
    ).pipe(map((res) => {
      return res;
    }));
  }

  public getUserProfile(): Observable<any> {
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_PROFILE_INFO}userId=${utilities.getChegUID()}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map((res) => {
      //console.log(res)
      return res;
    }));
  }

  public createChegUserId(): Observable<any> {
    // used in StartupService so this function is not used anymore
    let chegId = utilities.getChegUID() == null ? 0 : utilities.getChegUID();
    let mobileNo =
      utilities.getMobNumber() == null ? 0 : utilities.getMobNumber();
    let bankUID = utilities.getBankID() == null ? 0 : utilities.getBankID();
    let bankName = utilities.getBankName();
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_USER_INFO}UserId=${chegId}&bName=${bankName}&loginId=${bankUID}&pNum=${mobileNo}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map((res) => {
      return res;
    }));
  }

  public updateChegUserId(): Observable<any> {
    // used if new mobile number added by user
    let chegId = utilities.getChegUID() == null ? 0 : utilities.getChegUID();
    let mobileNo = utilities.getMobNumber() == null ? 0 : utilities.getMobNumber();
    let bankUID = utilities.getBankID() == null ? 0 : utilities.getBankID();
    let bankName = utilities.getBankName();
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_USER_INFO}UserId=${chegId}&bName=${bankName}&loginId=${bankUID}&pNum=${mobileNo}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map((res) => {
      return res;
    }));
  }

  public checkIfMobileRegistered(mobNumber: number): Observable<any> {
    this.count = this.count + 1;
    let chegId = utilities.getChegUID() == null ? 0 : utilities.getChegUID();
    let bankUID = utilities.getBankID() == null ? 0 : utilities.getBankID();
    let bankName = utilities.getBankName();
    const flag = 'COR';
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_IF_MOBILE_EXIST}pNum=${mobNumber}&bName=${bankName}&loginId=${bankUID}&userId=${chegId}&inVuserId=${bankUID}&flag=${flag}&count=${this.count}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map((res) => {
      return res;
    }));
  }

  public checkIfEmailRegistered(email: string): Observable<any> {
    const model: any = {
      email: email,
      bName: utilities.getBankName(),
      chegCustomerId: utilities.getChegUID() == null ? 0 : utilities.getChegUID(),
    };
    return this.dataService.parseApiCall(
      ApiConstants.URL.GET_IF_EMAIL_EXIST,
      'post',
      model,
      this.storageService.getTokenHeader()
    ).pipe(map((res) => {
      return res;
    }));
  }


  public checkIfVirtualIdExist(): Observable<any> {
    this.count = this.count + 1;
    let bName = utilities.getBankName();
    let virtualId = utilities.getBankID() == null ? 0 : utilities.getBankID();
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_IF_VIRTUALID_EXIST}virtualId=${virtualId}&bName=${bName}&count=${this.count}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map((res) => {
      return res;
    }));
  }

  public checkMobileOnForgot(mobNumber: number, type: string): Observable<any> {
    this.count = this.count + 1;
    let bankName = utilities.getBankName();
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_MOBILE_ONFORGOT}pNum=${mobNumber}&type=${type}&bName=${bankName}&count=${this.count}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map((res) => {
      return res;
    }));
  }

  public checkEmailOnForgot(email: string, userId: number): Observable<any> {
    this.count = this.count + 1;
    let bankName = utilities.getBankName();
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_EMAIL_ONFORGOT}email=${email}&bName=${bankName}&count=${this.count}&userId=${userId}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map((res) => {
      return res;
    }));
  }

  public checkIfMobileExistFromBank(mobNumber: number): Observable<any> {
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_CHECK_MOB_EXIST_BANK}pNum=${mobNumber}&bName=${utilities.getBankName()}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map((res) => {
      return res;
    }));
  }

  public updatePassword(password: string, chegId: number, usrName: any, pin: number): Observable<any> {
    const model: any = {
      password: password,
      userId: chegId,
      userName: usrName,
      pin: pin,
      deviceType: 'WEB',
    };
    return this.dataService.parseApiCall(
      ApiConstants.URL.POST_USER_PASSWORD,
      'post',
      model,
      this.storageService.getTokenHeader()
    ).pipe(map((res) => {
      return res;
    }));
  }

  public loginBank(mobNumber: number, password: string): Observable<any> {
    let bankName = utilities.getBankName();
    const model: any = {
      password: password,
      userName: mobNumber,
      bankName: bankName,
      deviceType: 'WEB',
    };
    return this.dataService.parseApiCall(
      ApiConstants.URL.GET_IF_USER_EXIST,
      'post',
      model,
      this.storageService.getTokenHeader()
    ).pipe(map((res) => {
      return res;
    }));
  }

  public loginCorp(email: string, password: string): Observable<any> {
    let bankName = utilities.getBankName();
    const model: any = {
      userName: email,
      password: password,
      bankName: bankName,
      deviceType: 'WEB',
    };
    return this.dataService.parseApiCall(
      ApiConstants.URL.POST_LOGIN_CORP,
      'post',
      model,
      this.storageService.getTokenHeader()
    ).pipe(map((res) => {
      return res;
    }));
  }

  public checkIfPinExist(pin: string, userId: number): Observable<any> {
    this.count = this.count + 1;
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_IF_PIN_EXIST}pin=${pin}&userId=${userId}&count=${this.count}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map((res) => {
      return res;
    }));
  }

  public sendOTP(pNum: number, userId: number, type: string): Observable<any> {
    this.count = this.count + 1;
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_SEND_OTP}pNum=${pNum}&userId=${userId}&type=${type}&count=${this.count}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map((res) => {
      return res;
    }));
  }

  public resendOTP(pNum: number, userId: number, type: string): Observable<any> {
    this.count = this.count + 1;
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_RESEND_OTP}pNum=${pNum}&userId=${userId}&type=${type}&count=${this.count}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map((res) => {
      return res;
    }));
  }

  public postUserInfo(data: any) {
    return this.dataService.parseApiCall(
      ApiConstants.URL.POST_USER_INFO,
      'post',
      data,
      this.storageService.getTokenHeader()
    ).pipe(map((res) => {
      return res;
    }));
  }

  public updateMobile(data: any) {
    return this.dataService.parseApiCall(
      ApiConstants.URL.POST_UPDATE_MOBILE,
      'post',
      data,
      this.storageService.getTokenHeader()
    ).pipe(map((res) => {
      return res;
    }));
  }

  public updateEmail(data: any) {
    return this.dataService.parseApiCall(
      ApiConstants.URL.POST_UPDATE_EMAIL,
      'post',
      data,
      this.storageService.getTokenHeader()
    ).pipe(map((res) => {
      return res;
    }));
  }

  public updateName(data: any) {
    return this.dataService.parseApiCall(
      ApiConstants.URL.POST_UPDATE_NAME,
      'post',
      data,
      this.storageService.getTokenHeader()
    ).pipe(map((res) => {
      return res;
    }));
  }
  
  public CreateSessionInfo(data: any): Observable<any> {
    return this.dataService
      .parseApiCall(
        `${ApiConstants.URL.CREATE_SESSION_INFO}`,
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

  public UpdateSessionDeatils(sessionId: any): Observable<any> {
    return this.dataService
      .parseApiCall(
        `${ApiConstants.URL.UPDATE_SESSION_DEATILS}sessionId=${sessionId}`,
        'post',
        '',
        this.storageService.getTokenHeader()
      )
      .pipe(
        map((res) => {
          return res;
        })
      );
  }
}
