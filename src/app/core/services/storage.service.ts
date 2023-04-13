import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
  /**
   * JSON stringify a value and store in session storage
   * @param  {string} key
   * @param  {any} data
   */
  public setSessionStorage(key: string, data: any) {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * JSON stringify a value and store in localstorage
   * @param  {string} key
   * @param  {any} data
   */
  public setLocalStorage(key: string, data: any) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  /**
   * Get a sessionstorage value stored under key
   * @param  {string} key
   */
  public getSessionStorage(key: string) {
    return JSON.parse(sessionStorage.getItem(key));
  }

  /**
   * Get a localstorage value stored under key
   * @param  {string} key
   */
  public getLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  public removeLocalStorage(key: string) {
    localStorage.removeItem(key);
  }


  /**
   * To check whether a key exist in localstorage
   * @param  {string} key
   */
  public isKeyExistInLocal(key: string) {
    return localStorage.getItem(key) != null;
  }

  /**
   * To check whether a key exist in sessionstorage
   * @param  {string} key
   */
  public isKeyExistInSession(key: string) {
    return sessionStorage.getItem(key) != null;
  }

  /**
   * Get http header for api calls
   */
  public getTokenHeader() {
    const tokenHeader = {
      // tslint:disable-next-line:max-line-length
      headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json', 'Authorization': "Bearer " + this.getSessionStorage('accessToken') })
    };
    return tokenHeader;
  }

  /**
   * Get http header for http multipart calls
   */
  public getTokenHeaderMulipart() {
    const tokenHeader = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'phoneId': String(this.getSessionStorage('phoneId')),
        'organizationId': String(this.getSessionStorage('organizationId')),
        'token': this.getSessionStorage('token'),
        'customerId': '9'
      })
    };
    return tokenHeader;
  }
}
