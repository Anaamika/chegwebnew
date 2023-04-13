// service to handle all api calls
import { Injectable, Inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiConstants } from '@config/api-constants';
// import { Router } from '@angular/router';
// import { catchError, retry } from 'rxjs/operators';
// import { StorageService } from '@core/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    public http: HttpClient
  ) { }

  /**
   * Function to handle all http calls
   * @param  {string} url
   * @param  {string} method
   * @param  {any} data
   * @param  {any} header
   * @returns Observable
   */
  public parseApiCall(url: string, method: string, data: any, header: any): Observable<any> {
    switch (method) {
      case 'get':
        return this.http.get(url, header)

      case 'post':
        return this.http.post(url, data, header)
      // .pipe(
      //   retry(5),
      //   catchError(this.handleError('post', []))
      // );   //not required since http-error.interceptor is handling this now

      case 'put':
        return this.http.put(url, data, header)
      // .pipe(
      //   retry(5),
      //   catchError(this.handleError('put', []))
      // );

      case 'delete':
        return this.http.delete(url, header)
      // .pipe(
      //   retry(5),
      //   catchError(this.handleError('delete', []))
      // );

      default:
        console.error('Invalid method');
        break;
    }
  }
  /**
   * Function to check if the response is success
   * @param  {} response
   * @returns boolean
   */
  public isResponseStatusSuccess(response): boolean {
    return response['Response']['Status']['statusCode'] === ApiConstants.STATUS_CODES.SUCCESS;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      try {
        if (error.error.Response.Status.statusCode === ApiConstants.STATUS_CODES.AUTH_ERROR) {
          this.handleAuthError();
        }
      } catch (error) { }
      // TODO: better job of transforming error for user consumption
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  public handleAuthError() {
    // this.storageService.setSessionStorage('user', null);
    // this.storageService.setSessionStorage('token', null);
    // this.storageService.setSessionStorage('phoneId', null);
    // this.storageService.setSessionStorage('organizationId', null);
    // this.router.navigateByUrl('login');
  }
}
