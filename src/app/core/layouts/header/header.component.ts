import { Component, Inject, Renderer2, OnInit, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject, fromEvent } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { CategoriesDataProviderService } from '@core/services/categories-data-provider.service';
import { StoresDataProviderService } from '@core/services/stores-data-provider.service';
import { StorageService } from '@core/services/storage.service';
import { DialogService } from '@core/services/dialog.service';
import { utilities } from '@utilities/utilities';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import Swal from 'sweetalert2';
import { gsap, TweenMax, Circ } from "gsap/all";
import { BreakpointObserver } from '@angular/cdk/layout';
//import { NgxIndexedDBService } from 'ngx-indexed-db';
import { DOCUMENT } from '@angular/common';
import { impressionData } from '@app/shared/models/impression-data';
import { MatSnackBar } from '@angular/material/snack-bar';

//Avoid treeshaking
gsap.registerPlugin(Circ);

declare var require: any;
const MyPromise = require('promise');
const confetti = require('canvas-confetti');
confetti.Promise = MyPromise;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  bank = utilities.getBankName();
  bankFullName = utilities.getBankFullName();
  mobileView: boolean = false;
  panelOpenState = false;
  return: string = '';

  theme = this.bank == '' ? 'cheggout' : this.bank;
  isBandhan:boolean = this.bank =='BANDHAN'?true:false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  mainCategories = [];
  storesgridData = []
  subCategories = [];
  relatedStores = [];
  catUID: number;
  selctedCatNode: string;
  selctedcatTitle: string;
  isPopular: boolean = false;
  isBFSL: boolean = false;
  isBFSLbanner: boolean = false;
  isBFSLlogo: boolean = false;
  popularName: string;
  toggleMegaMenu: boolean = false;
  cashbackText:string = this.bank =='BANDHAN'?"Bandhan Bank customers earn":this.bank+" customers earn"; 
  @ViewChild('Header') header: ElementRef;
  @ViewChild('menuOverlay') menuOverlay: ElementRef;
  @ViewChild('showMenuBtn') showMenuBtn: ElementRef;
  @ViewChild('sideNav') sideNav: ElementRef;
  @ViewChild('showSideNavBtn') showSideNavBtn: ElementRef;
  @ViewChild('sideNavExtended') sideNavExtended: ElementRef;
  @ViewChild('myAccount') myAccount: ElementRef;
  public show: boolean = false;

  scroll: boolean = false;
  userLoggedIn: boolean = false;
  userName: string = '';
  mobileNum: string = '';

  walletBalance: number = 0;
  isHR: boolean = false;
  type = utilities.getType();
  bankName= utilities.getBankName();
  ifProfile = utilities.isProfileEnabled();

  isAccountTypeA: boolean = false;
  isBank: boolean = false;
  constructor(
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private userService: UserService,
    private categoryService: CategoriesDataProviderService,
    private storeService: StoresDataProviderService,
    private storageService: StorageService,
    private breakpointObserver: BreakpointObserver,
    //private dbService: NgxIndexedDBService,
    private dialogService: DialogService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private _snackBar: MatSnackBar
  ) {
    fromEvent(window, 'resize').subscribe((e: any) => {
      this.checkBrowserWidth();
    });
  }

  ngOnInit(): void {
    this.type = utilities.getType();
    if (this.type?.toLowerCase() === 'bank') {
      this.isBank = true;
    } else {
      this.isBank = false;
    }
    this.renderer.addClass(this.document.body, 'theme--' + this.theme.toLowerCase());
    this.isAccountTypeA = (utilities.isAccountTypeA() || this.authService.isAuthenticated());
    this.authService.isRegistration = utilities.getIsRegistration();
    this.authService.isReward = (utilities.getIsReward() == true);

    if(!utilities.isAccountTypeA()) {
      this.logout();
    }

    if (this.bankName === 'BFSL') {
      this.isBFSL = false;
    } else {
      this.isBFSL = true;
    }

    if (this.bankName === 'BFSL') {
      this.isBFSLbanner = true;
    } else {
      this.isBFSLbanner = false;
    }

    if (this.bankName === 'BFSL') {
      this.isBFSLlogo = false;
    } else {
      this.isBFSLlogo = true;
    }

    // this.route.queryParams
    //   .subscribe(params => this.return = params['return'] || '/');  //Set in AuthGuard, to get initial URL  //not used now

    // let userId = utilities.getChegUID();
    // if (userId == null) {  // just to make sure UserID is created since userID is used to call other API's
    //   this.fetchEvent();
    // } else {
    // }

    this.checkBrowserWidth();

    // Custom bootsrtap dropdown activate function
    setTimeout(() => {
      let self = this;
      if (this.header !== undefined) {
        let ddbtn = this.header.nativeElement.querySelector('.select-dropdown-toggle');
        if (ddbtn !== null) {
          ddbtn.addEventListener('mouseover', function (event) {
            event.stopPropagation();
            this.parentElement.classList.toggle('show');
            this.nextElementSibling.classList.toggle('show');
            if (self.userLoggedIn) {
              this.classList.add('no-pointer-events')
            }
          });

          ddbtn.parentElement.addEventListener('mouseleave', function (event) {
            event.stopPropagation();
            this.querySelector('.dropdown-menu').classList.remove('show');
            this.classList.remove('show');
            if (self.userLoggedIn) {
              ddbtn.classList.remove('no-pointer-events');
            }
          });
        }
      }
    }, 200);

    if (this.authService.isAuthenticated()) {
      this.userLoggedIn = true;
      this.userName = this.authService.userName;
      this.mobileNum = this.authService.mobNumber;
      this.getUserDetails();
    } else {
      this.userLoggedIn = false;

      if (!this.isBank) {
        let loggedOut = this.storageService.getLocalStorage('loggedOut');
        if (!loggedOut) {
          this.loginDialog()
        }
      }     

      //if (utilities.isCanara() || utilities.isPNB()){
      //  let mobileNum = utilities.getMobNumber();
      //  if( mobileNum != 0 && mobileNum != null){
      //    this.loginDialog();
      //  }
      //} 
    }


    if ((utilities.isCanara() || utilities.isPNB()) && utilities.checkVirtualIdSessionId()) {
      let isValid = utilities.checkIsValid() == 'true' ? true : false;
      if (isValid) {
        let isRegistered = utilities.checkIsRegistetred() == 'true' ? true : false;
        if (isRegistered) {
          this.getUserProfile();
          this.getUserDetails();
        } else {
          this.loginDialog();
        }

      } else {
        this._snackBar.open("Session is timed out!!", "", {
          duration: 5000,
          panelClass: ['red-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.logout();
        if(utilities.isPNB()) {
          this.openUserNotification();
        } else {
          this.loginDialog();
        }
      }
    }

    this.authService.userObservable.pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.userLoggedIn = true;
      this.userName = this.authService.userName;
      this.mobileNum = this.authService.mobNumber;
      this.getUserDetails();
    });

    this.userService.walletObservable.pipe(takeUntil(this.destroy$)).subscribe(res => {
      this.getUserDetails();
    });

    setTimeout(() => {
      this.getAllMainCategories();
      this.getAllStores();
      const init = this.document.querySelector('.init');
      init.classList.add('d-none');
    }, 200);

    if (this.bankName === 'BFSL' || this.type === 'Corp') {
          this.router.navigate(['/account/redeem']);
    }

    this.cashbackText = this.bank == 'BFSL' ? "Welcome to the Rewarding world of BoB Credit Cards. Explore your Joy!" : this.cashbackText; 
  }

  // fetchEvent() {
  //   this.authService.createChegUserId()
  //     .pipe(takeUntil(this.destroy$)).subscribe(res => {
  //       let obj = {};
  //       if (res.length > 0) {
  //         obj['userId'] = res[0].chegCustomerId;
  //         obj['bankUID'] = res[0].loginId;
  //         obj['mobNumber'] = res[0].mobileNo;
  //         obj['bankName'] = utilities.getBankName();
  //         obj['favCategories'] = [];
  //         obj['favStores'] = [];
  //         obj['savedOffers'] = [];
  //         obj['savedProducts'] = [];

  //         // this.dbService.add('user', obj).then(() => {
  //         // },
  //         //   error => {
  //         //   });
  //         this.storageService.setLocalStorage('chegUID', res[0].chegCustomerId);
  //         this.storageService.setLocalStorage('bankUID', res[0].loginId);
  //         this.storageService.setLocalStorage('mobileNumber', res[0].mobileNo);

  //         this.getAllMainCategories();
  //         this.getAllStores();
  //         setTimeout(() => {
  //           this.router.navigateByUrl(this.return);
  //         }, 1000);
  //       }
  //     }, err => {
  //     });
  // }

  public openUserNotification(): void {
    utilities.addHTMLClass(['login_page']);
    const options = {
      title: 'SORRY..!!',
      message1: `This service is available only for PNB Customers. `,
      message2: 'Please login to your Internet banking / PNB One Mobile app to avail the benefits.',
    };

    this.dialogService.openNotify(options);
    utilities.removeHTMLClass(['login_page']);
  }

  checkBrowserWidth() {
    if (this.breakpointObserver.isMatched('(max-width: 575px)')) {
      //body.classList.add('mobile', 'portrait');
      utilities.removeBodyClass(['landscape', 'tablet', 'laptop']);
      utilities.addBodyClass(['mobile', 'portrait']);
      this.mobileView = true;
    } else if (this.breakpointObserver.isMatched('(min-width: 576px)') && this.breakpointObserver.isMatched('(max-width:  767px)')) {
      //body.classList.add('mobile', 'landscape');
      utilities.removeBodyClass(['portrait', 'tablet', 'laptop']);
      utilities.addBodyClass(['mobile', 'landscape']);
      this.mobileView = true;
    } else if (this.breakpointObserver.isMatched('(min-width: 768px)') && this.breakpointObserver.isMatched('(max-width:  1023px)')) {
      utilities.removeBodyClass(['landscape', 'mobile', 'laptop']);
      utilities.addBodyClass(['tablet', 'portrait']);
      this.mobileView = true;
    } else if (this.breakpointObserver.isMatched('(min-width: 1024px)') && this.breakpointObserver.isMatched('(max-width:  1365px)')) {
      utilities.removeBodyClass(['portrait', 'mobile', 'laptop']);
      utilities.addBodyClass(['tablet', 'landscape']);
      this.mobileView = false;
    } else {
      utilities.removeBodyClass(['portrait', 'landscape', 'mobile', 'tablet']);
      utilities.addBodyClass(['laptop']);
      this.mobileView = false;
    }

    //if (this.mobileView) {
    window.addEventListener('scroll', this.scrolling, true)
    // }

    if (utilities.isIOS()) {
      utilities.addBodyClass(['ios']);
    }
  }

  public GetRouterLink(flag?: string): string {
    if ((utilities.getBankName() === 'MRESULT' || utilities.getBankName() === 'BFSL') && flag !== 'logout') {
       return '/account/redeem' 
      }
    else { 
      return '/' 
    }
  }

  navigateHome() {
    this.router.navigateByUrl('/account/redeem');
  }

  private getAllMainCategories() {
    this.categoryService.getmainCategories()
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res.length > 0) {
          this.mainCategories = res;
          let title = this.mainCategories[0]['categoryName'];
          let nodeId = this.mainCategories[0]['nodeId'];
          let id = this.mainCategories[0]['id'];
          this.getAllSubCategories(title, nodeId, id, false, null);
        }
      }, err => {
      });
  }

  public getAllSubCategories(nodeTitle, nodeId, id, isPopular, popularName) {
    this.catUID = id;
    this.selctedCatNode = nodeId;
    this.selctedcatTitle = nodeTitle;
    this.isPopular = isPopular;
    this.popularName = popularName;
    this.subCategories = [];
    this.categoryService.getsubCategories(nodeId)
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res) {
          this.subCategories = res;
        }
      }, err => {
      });

    this.geRelatedStores(id);
  }
  
  private getAllStores() {
    this.storeService.getallStores()
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res.length > 0) {
          this.storesgridData = res;
        }
      }, err => {
      });
  }

  private geRelatedStores(id) {
    if (this.storesgridData.length > 0) {
      this.relatedStores = [];
      let jsonArray = [];
      this.storesgridData.forEach(element => {
        let catId = element.catID
        if (catId !== null) {
          var catIdArr = catId.split(', ');
          if (catIdArr.includes(id.toString())) {
            jsonArray.push(element);
          }
        }
      });
      this.relatedStores = utilities.getUniqueJasonObj(jsonArray, it => it.siteID);
    }
    else {
      setTimeout(() => {
        this.geRelatedStores(id);
      }, 250);
    }
  }

  navigateToCategory(catUID: number, catNode: string, catTitle: string, isPopular: boolean, popularName: string, rootCatNode: string = '', rootCatTitle: string = '') {
  this.onVisible(catTitle,'Click')
    if (this.mobileView) {
      this.hideSideNavExtended()
    } else {
      this.hideMegaMenu();
    }
    if (isPopular) {
      this.categoryService.gotoCategoryPagePopular(catUID, catNode, catTitle, rootCatNode, rootCatTitle, popularName);
    } else {
      this.categoryService.gotoCategoryPage(catUID, catNode, catTitle, rootCatNode, rootCatTitle);
    }
  }

  //for Mobile
  public showSideNav($event) {
    $event.preventDefault();
    utilities.addBodyClass(['hidescroll']);
    this.sideNav.nativeElement.classList.add('open');
    TweenMax.to(this.sideNav.nativeElement, .2, { left: '0', opacity: 1, ease: Circ.easeOut });
  }

  public hideSideNav() {
    utilities.removeBodyClass(['hidescroll']);
    this.sideNav.nativeElement.classList.remove('open');
    TweenMax.to(this.sideNav.nativeElement, .2, { left: '-100vw', opacity: 1, ease: Circ.easeOut });
  }

  public showSideNavExtended($event, categoryName, nodeId, id, isPopular, popularName) {
    $event.preventDefault();
    this.getAllSubCategories(categoryName, nodeId, id, isPopular, popularName);
    this.hideSideNav();
    utilities.addBodyClass(['hidescroll']);
    TweenMax.to(this.sideNavExtended.nativeElement, .2, { left: '-0', opacity: 1, ease: Circ.easeOut });
  }

  public hideSideNavExtended() {
    utilities.removeBodyClass(['hidescroll']);
    TweenMax.to(this.sideNavExtended.nativeElement, .2, { left: '-100vw', opacity: 1, ease: Circ.easeOut });
  }

  //for desktop
  public showMegaMenu($event) {
    $event.preventDefault();
    this.show = !this.show;
    const header = this.document.getElementsByTagName('header')[0];
    let offset = header.offsetTop;
    if (this.show) {
      TweenMax.to(this.menuOverlay.nativeElement, .2, { top: offset + header.clientHeight, opacity: 1, ease: Circ.easeOut });
    }
    else {
      TweenMax.to(this.menuOverlay.nativeElement, .4, { top: '-100vh', opacity: 1, ease: Circ.easeOut });
    }
    this.document.body.classList.toggle('overflow-hidden');
    this.showMenuBtn.nativeElement.querySelector('.hamb').classList.toggle('opened')
    this.showMenuBtn.nativeElement.querySelector('.hamb').setAttribute('aria-expanded', this.showMenuBtn.nativeElement.querySelector('.hamb').classList.contains('opened'))
  }

  hideMegaMenu() {
    TweenMax.to(this.menuOverlay.nativeElement, .4, { top: '-100vh', opacity: 1, ease: Circ.easeOut });
    this.showMenuBtn.nativeElement.querySelector('.hamb').classList.remove('opened')
    this.show = false;
    this.document.body.classList.remove('overflow-hidden');
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: any) {
    if (this.showMenuBtn) {
      if (!this.menuOverlay.nativeElement.contains(event.target) && event.target !== this.showMenuBtn.nativeElement) {
        this.hideMegaMenu();
      }
    }
    if (this.mobileView) {
      if (!this.sideNav.nativeElement.querySelector('.bg').contains(event.target) && !this.sideNav.nativeElement.querySelector('.sidenav_content').contains(event.target) && event.target !== this.showSideNavBtn.nativeElement) {
        this.hideSideNav();
      }
    }
  }

  scrolling = (s) => { //make fixed header
    const header = this.document.getElementsByTagName('header')[0];
    if (s.target.scrollingElement) {
      let sc = s.target.scrollingElement.scrollTop;
      if (sc >= header.clientHeight) { this.scroll = true }
      else { this.scroll = false }
    }
  }

  public openLoginDialog($event) {
    if (!this.userLoggedIn) {
      this.loginDialog()
    }
  }

  public loginDialog() {
    if (!this.userLoggedIn) {
      utilities.addHTMLClass(['login_page']);
      if (this.mobileView) {
        if (this.sideNav) {
          this.hideSideNav();
        }
      }
      const options = {
        title: 'Avinash',
        message: 'Login',
        cancelText: 'Cancel',
        confirmText: 'Confirm'
      };
      
      this.dialogService.openLogin(options);
      this.dialogService.loginConfirmed().subscribe(confirmed => {
        if (confirmed) {
          if (!this.isBank) {
            if (confirmed == 'registered') {
              //this.celebrate();
            }
          }
          //do something if confirmed is true
          this.getUserDetails();
        }
        if (this.bankName === 'BFSL' || this.type === 'Corp') {
                this.router.navigate(['/account/redeem']);
              }

        utilities.removeHTMLClass(['login_page']);
      });
    }
  }

  private getUserDetails() {
    this.mobileNum = utilities.getMobNumber();
   
    this.userService.getRedeemBalance()
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res.length > 0) {
          this.walletBalance = res[0].walletBalance;
          this.isHR = this.authService.isHR(utilities.geHRRoleID());
          this.type = utilities.getType();
        }
      }, err => {
      });
  }

  public logout() {
    this.updatesessiondeatils();
    if(utilities.isPNB()) {
      sessionStorage.clear();
      localStorage.clear();
      this.openUserNotification();
      this.router.navigateByUrl('/');
      this.router.resetConfig([]);
    }
    this.storageService.setLocalStorage('mobileNumber', 0);
    this.storageService.setLocalStorage('loggedOut', true);
    this.storageService.removeLocalStorage('userName');
    this.storageService.removeLocalStorage('emailID');
    this.storageService.removeLocalStorage('bankUID');
    this.storageService.removeLocalStorage('encdata');
    this.authService.setUserDetails('', '', '', 0);
    this.walletBalance = 0;
    this.userLoggedIn = false;

    this.authService.getRefreshToken()
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        this.storageService.setSessionStorage('accessToken', decodeURIComponent(res.result));
        this.router.navigateByUrl('/');
        this.document.querySelector('.dropdown-menu').classList.remove('show');
        this.document.querySelector('.select-dropdown-toggle').classList.remove('show');
        this.document.querySelector('.select-dropdown-toggle').classList.remove('no-pointer-events');
      }, err => {
      });
   
  }

  public logoutWithNoRefreshtoken() {
    sessionStorage.clear();
    this.storageService.setLocalStorage('mobileNumber', 0);
    this.storageService.setLocalStorage('loggedOut', true);
    this.storageService.removeLocalStorage('userName');
    this.storageService.removeLocalStorage('emailID');
    this.storageService.removeLocalStorage('bankUID');
    this.storageService.removeLocalStorage('encdata');
    this.authService.setUserDetails('', '', '', 0);
    this.walletBalance = 0;
    this.userLoggedIn = false;

  }

  updatesessiondeatils(){
    let SessionId = this.storageService.getSessionStorage('sessionId');
      this.authService.UpdateSessionDeatils(SessionId).pipe(takeUntil(this.destroy$)).subscribe((res) => {        
      })
  }
  
  celebrate() {
    this.createConfetti();
    Swal.fire({
      title: '500 Reward Points for you!!!',
      text: 'Redeem now and get your favourite Gift Voucher instantly delivered.',
      imageUrl: '/assets/images/reward-recieved.gif',
      imageWidth: 300,
      imageHeight: 300,
      imageAlt: 'Rewards for you',
      showDenyButton: false,
      showCancelButton: false,
      confirmButtonText: `Redeem Now`,
      customClass: {},
      showClass: {
        popup: 'animate__animated animate__tada'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp'
      },
      backdrop: `
      rgb(0 0 0 / 70%)
      left top
      no-repeat
    `
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.router.navigateByUrl('/account/redeem');
      }
    })
  }

  createConfetti() {
    let canvas = document.getElementById('my-canvas');
    // you should  only initialize a canvas once, so save this function
    // we'll save it to the canvas itself for the purpose of this demo
    let myConfetti = confetti.create(canvas, { resize: true });

    myConfetti({
      particleCount: 200,
      startVelocity: 30,
      spread: 360,
      // origin: {
      //   x: Math.random(),
      //   // since they fall down, start a bit higher than random
      //   y: Math.random() - 0.2
      // }
    });
  }

  onImgError($event) {
    let ext = utilities.getUrlExtension($event.srcElement.currentSrc)
    if (ext === 'webp') {
      $event.onerror = null;
      $event.srcElement.parentNode.children[0].srcset = $event.srcElement.parentNode.children[1].srcset = $event.srcElement.attributes.src.value;
    } else {
      $event.srcElement.parentNode.children[0].srcset = $event.srcElement.parentNode.children[1].srcset = '/assets/images/no-image.png';
    }
  }

  remove($event) {
    $event.srcElement.parentElement.parentElement.remove();
  }
  onVisible(data,eventType) {
    let arrayObj = new impressionData();
    arrayObj.type = eventType;
    arrayObj.page_name ='home_page';
    arrayObj.type = eventType;
    arrayObj.section = 'Category';
    arrayObj.id = data.productId;
    arrayObj.idType='category';
    arrayObj.name = data;
    utilities.saveImpressionDetails(arrayObj);
  }
  getUserProfile() {
    this.authService.getUserProfile().pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.storageService.setSessionStorage('userName', res[0].firstName);
      this.storageService.setSessionStorage('mobileNumber', res[0].mobileNo);
      this.storageService.setSessionStorage('emailID', res[0].emailId);
      //added for login flow
      this.storageService.setLocalStorage('userName', res[0].firstName);
      this.storageService.setLocalStorage('mobileNumber', res[0].mobileNo);
      this.storageService.setLocalStorage('emailID', res[0].emailId);
      //added for login flow
      this.authService.setUserDetails(res[0].firstName, res[0].mobileNo, res[0].emailId, res[0].chegCustomerId);
      this.storageService.setLocalStorage('loggedOut', false);
    },
      (err) => {
      }
    );
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
