import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

import { StartupService } from '@core/services/startup.service';
import { StorageService } from '@core/services/storage.service';
import { DialogService } from './core/services/dialog.service';
import { AuthService } from '@core/services/auth.service';
import { utilities } from '@utilities/utilities';

declare let gtag: Function;

/**
 * @description
 *
 * 1. {@link StartupService} is called to get and save all configuration data in local storage for future reference
 *
 * 2. Dynamically set google tracking ID based on the bankname
 *
 * @example
 * let trackingID = utilities.getGATrackingID();
 *    if (trackingID !== undefined) {
 *      gtag('config', trackingID, {'page_path': event.urlAfterRedirects});
 *    }
 *
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  title = 'Cheggout';
  bank = utilities.getBankName();

  constructor(
    @Inject(DOCUMENT) private document: HTMLDocument,
    private titleService: Title,
    private router: Router,
    private idle: Idle,
    private keepalive: Keepalive,
    private startup: StartupService,
    private storageService: StorageService,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService,
    private authService: AuthService
  ) {
    this.handleIdleApplication();
    router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      let trackingID = utilities.getGATrackingID();
      if (trackingID !== undefined) {
        gtag('config', trackingID,
          {
            'page_path': event.urlAfterRedirects
          }
        );
      }
      const queryParams = this.activatedRoute.snapshot.queryParams;
      if (Object.keys(queryParams).length > 0) {
        this.router.navigate(["/"]);
      }
    });
  }

  logoutOnClose() {
    localStorage.setItem('SessionLogged', 'called!!!');
  }

  ngOnInit() {
    this.validateUserEntry();
  }

  /**
   * Trace Idleness of the application, if so logout from the application
   */
  private handleIdleApplication(): void {
    // sets an idle timeout of 600sec/10min.
    this.idle.setIdle(30); // 3sec for testing
    // sets a timeout period of 300sec/5min. after 5min of inactivity, the user will be considered timed out.
    this.idle.setTimeout(5); // 5sec for testing
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onTimeout.subscribe(() => {
      this.openUserNotification();
      this.logout();
    });

    // sets the ping interval to 60Sec/1min
    this.keepalive.interval(60);
    this.idle.watch();
  }

/**
 * Logout on the application is Idle for more than 10 minutes
 */
  private logout() {
    if (utilities.isPNB()) {
      sessionStorage.clear();
      localStorage.clear();
      this.openUserNotification();
      this.router.navigateByUrl('/');
      this.router.resetConfig([]);
      this.storageService.setLocalStorage('mobileNumber', 0);
      this.storageService.setLocalStorage('loggedOut', true);
      this.authService.setUserDetails('', '', '', 0);
    }
  }

  private validateUserEntry(): void {
    if ((!utilities.checkVirtualIdSessionId() && utilities.isPNB()) && this.authService.isActiveSession()) { //TODO: Need to check this condition
      this.openUserNotification();
    } else {
      this.initLoad();
    }
  }

  public initLoad() {
    let context = this;
    window.addEventListener("beforeunload", function (e) {
      context.logoutOnClose();
    });
    let url = utilities.getFavicon();
    this.document.getElementById('appFavicon').setAttribute('href', url);
    this.titleService.setTitle(this.bank + ' - SHOP . EARN . REDEEM');

    let obj = {};

    let id = utilities.getChegUID();

    // If there is no startup data received (maybe an error!)
    // navigate to error route
    //console.log(this.startup.startupData)
    if (!this.startup.startupData) {
      //this.router.navigate(['error'], { replaceUrl: true });
    } else {

      let data = this.startup.startupData[0];
      //console.log(data)
      // obj['chegUId'] = data.chegCustomerId;
      // obj['bankUId'] = data.loginId;
      // obj['phoneNumber'] = data.mobileNo;
      // obj['bankName'] = data.bankName;
      // obj['userName'] = null;
      // obj['emailID'] = null;
      // obj['rewardBalance'] = null;
      // obj['isRegistration'] = data.isRegistration;
      // obj['isReward'] = data.isReward;
      // obj['isRegistered'] = data.isRegistered;
      // obj['accessToken'] = data.token;
      // obj['refreshToken'] = data.refreshToken;
      // obj['expireDate'] = data.expireDate;

      // this.dbService.add('user', obj).then(() => {
      //   console.log('user info added to indexedDB')
      // }, error => {
      //   console.log(error);
      // });


      if ((utilities.isCanara() || utilities.isPNB()) && utilities.checkVirtualIdSessionId()) {
        this.storageService.setLocalStorage('isValid', data.isValid);
        this.storageService.setLocalStorage('isRegistered', data.isRegistered);
        if (data.isValid) {
          this.storageService.setLocalStorage('mobileNumber', data.mobileNo);
          this.storageService.setLocalStorage('isRegistration', data.isRegistration);
          this.storageService.setLocalStorage('isReward', data.isReward);
          this.storageService.setLocalStorage('type', data.type);
          this.storageService.setLocalStorage('bankName', data.bankName)
          this.storageService.setLocalStorage('domain', data.domain)

          this.storageService.setSessionStorage('accessToken', decodeURIComponent(data.token));
          this.storageService.setSessionStorage('refreshToken', decodeURIComponent(data.refreshToken));
          this.storageService.setSessionStorage('expireDate', data.expireDate);
          this.storageService.setLocalStorage('chegUID', data.chegCustomerId);
        }
      } else {
        this.storageService.setLocalStorage('chegUID', data.chegCustomerId);
        if (!utilities.isCallingBankAPI() || ((utilities.isCanara() || utilities.isPNB()) && !utilities.checkVirtualIdSessionId())) {
          this.storageService.setLocalStorage('bankUID', data.loginId);
          if (data.isRegistered) {
            this.storageService.setLocalStorage('mobileNumber', data.mobileNo);
          } else {
            this.storageService.setLocalStorage('mobileNumber', 0);
          }
        }

        this.storageService.setLocalStorage('isRegistration', data.isRegistration);
        this.storageService.setLocalStorage('isReward', data.isReward);
        this.storageService.setLocalStorage('type', data.type);
        this.storageService.setLocalStorage('bankName', data.bankName)
        this.storageService.setLocalStorage('domain', data.domain)

        this.storageService.setSessionStorage('accessToken', decodeURIComponent(data.token));
        this.storageService.setSessionStorage('refreshToken', decodeURIComponent(data.refreshToken));
        this.storageService.setSessionStorage('expireDate', data.expireDate);
      }
    }
  }

  public openUserNotification(): void {
    utilities.addHTMLClass(['login_page']);
    const options = {
      title: 'SORRY..!!',
      message1: `This service is available only for PNB Customers. `,
      message2: 'Please login to your Internet banking / PNB One Mobile app to avail the benefits.',
    };
    this.dialogService.openNotify(options);
    // this.dialogService.closeNotify().subscribe(closed => {
    //   this.router.navigateByUrl('/');
    // });
    utilities.removeHTMLClass(['login_page']);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
