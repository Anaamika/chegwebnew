import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { DataService } from '@core/services/data.service';
import { AuthService } from '@core/services/auth.service';
import { StorageService } from '@core/services/storage.service';
import { ApiConstants } from '@config/api-constants';
import { utilities } from '@utilities/utilities';
@Injectable({
    providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {

    constructor(
        private dataService: DataService,
        private authService: AuthService,
        private storageService: StorageService,
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                retry(5),
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';
                    if (error.error instanceof ErrorEvent) {
                        // client-side error
                        errorMessage = `Error: ${error.error.message}`;
                    } else {
                        // server-side error
                        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
                        if (error.status == 401) {
                            if (this.authService.isAuthenticated()) {
                                this.handleAuthErrorLoggedInUser();
                            } else {
                                this.handleAuthError();
                            }
                        }
                    }
                    let css = "background-color: #dc5b4a; color: #fff; padding: .5rem;";
                    console.log("%c error: %s", css, errorMessage);
                    return throwError(errorMessage);
                })
            )
    }

    handleAuthError() {
        this.dataService.parseApiCall(
            `${ApiConstants.URL.GET_REFRESH_TOKEN}ChegCustomerId=${utilities.getChegUID()}`,
            'get',
            '',
            ApiConstants.COMMON_HEADER
        ).subscribe(res => {
            this.storageService.setSessionStorage('accessToken', decodeURIComponent(res.result));
            window.location.reload();
        }, err => {
        });
    }

    handleAuthErrorLoggedInUser() {
        const obj = {
            token: this.storageService.getSessionStorage('accessToken'),
            refreshToken: this.storageService.getSessionStorage('refreshToken'),
            deviceType: "WEB",
            expireDate: this.storageService.getSessionStorage('expireDate'),
        }
        this.dataService.parseApiCall(
            ApiConstants.URL.POST_REFRESH_TOKEN_LOGGEDIN_USER,
            'post',
            obj,
            ApiConstants.COMMON_HEADER
        ).subscribe(res => {
            this.storageService.setSessionStorage('accessToken', decodeURIComponent(res.result));
            window.location.reload();
        }, err => {
        });
    }
}