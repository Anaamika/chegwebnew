import { Component, OnInit, ViewChild, ElementRef, Inject, HostListener, OnDestroy, } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import * as CRYPTO from 'crypto-js';

// import { AnimationItem } from 'lottie-web';
// import { AnimationOptions } from 'ngx-lottie';
import { gsap, TweenMax, Circ } from 'gsap/all';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '@core/services/auth.service';
import { StorageService } from '@core/services/storage.service';
import { SearchService } from '@app/core/services/search.service';
import { utilities } from '@utilities/utilities';
//import { FormModel } from '@app/core/core.module';
import { RecaptchaComponent } from 'ng-recaptcha';
import Swal from 'sweetalert2';

gsap.registerPlugin(Circ);
@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
})
export class LoginDialogComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  userId: number;
  type = utilities.getType();
  bankName= utilities.getBankName();
  loginType: string;
  ifLogin: boolean = false;
  canSkip: boolean = false;
  validOTP: boolean = false;
  otpTried: boolean = false;
  showLoader: boolean = false;
  pwdhide: boolean = true;
  isCaptchaVerified: boolean = true;
  isLoginPage: boolean = true;
  action = {};
  bankFullName = utilities.getBankFullName();
  year = new Date().getFullYear();
  //public formModel: FormModel = {};
  ifHideOTP: boolean = false
  enableMaskedField: boolean = false;
  isRegistration = utilities.getIsRegistration();
  isBFSL: boolean = false;

  @ViewChild('Content') Content: ElementRef;
  @ViewChild('Login') Login: ElementRef;
  @ViewChild('Register') Register: ElementRef;
  @ViewChild('ForgotPWD') ForgotPWD: ElementRef;
  @ViewChild('captchaRef') captchaRef: RecaptchaComponent;
  @ViewChild('password') password: ElementRef;
  @ViewChild('mobNumber') mobNumber: ElementRef;
  // @ViewChild('lottieNav') LottieNav: ElementRef;
  // @ViewChild('Compare') Compare: ElementRef<HTMLElement>;
  // @ViewChild('Coupon') Coupon: ElementRef<HTMLElement>;
  // @ViewChild('Save') Save: ElementRef<HTMLElement>;

  //For Validation
  mobileFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[0-9]*$'),
    Validators.minLength(10),
  ]);

  pwdFormControl = new FormControl('', [Validators.required]);

  otpFormControl = new FormControl('');

  nameFormControl = new FormControl('', [Validators.required]);

  setpwdFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(4),
  ]);

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private storageService: StorageService,
    private searchService: SearchService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      cancelText: string;
      confirmText: string;
      message: string;
      title: string;
    },
    private mdDialogRef: MatDialogRef<LoginDialogComponent>
  ) {
    this.action = data;
  }

  ngOnInit(): void {
    console.log('data',this.data);
    console.log('mobNumber',this.mobNumber);
    this.loginType = this.action['message'];
    if (this.loginType == 'Login') {
      this.canSkip = false;
    } else if (this.loginType == 'Verify') {
      this.canSkip = true;
    }
    setTimeout(() => {
      if (this.mobNumber) {
        this.mobNumber.nativeElement.focus();
      }
    }, 500);
    
    if (utilities.isCallingBankAPI() || (utilities.isCanara() && utilities.checkVirtualIdSessionId())) {
      let bankUID = utilities.getBankID();
      if (!bankUID || bankUID != '0' || bankUID != 0) {
        // let mobileNo = utilities.getMobNumber() == null ? 0 : utilities.getMobNumber();
        // if (mobileNo) {
        //   this.mobileFormControl.setValue(mobileNo);
        //   this.enableMaskedField = true;
        //   setTimeout(() => {
        //     this.captchaRef.execute();
        //   }, 200);

        // } else {
        this.authService.checkIfVirtualIdExist().pipe(takeUntil(this.destroy$)).subscribe((res) => {
          //console.log(res)
          if (res.length > 0) {
            if (res[0].isRegistered) {
              if (res[0].mobileNo || res[0].mobileNo != 0 || res[0].mobileNo != '0') {
                this.storageService.setLocalStorage('mobileNumber', res[0].mobileNo);
                this.mobileFormControl.setValue(res[0].mobileNo);
                this.enableMaskedField = true;
                setTimeout(() => {
                  this.captchaRef.execute();
                }, 200);
              }
            }
          }
        },
          (err) => { }
        );
        //}
      }
    }

    if (this.bankName === 'BFSL') {
      this.isBFSL = true;
    } else {
      this.isBFSL = false;
    }
  }

  public cancel() {
    this.close(false);
  }
  public close(value) {
    this.mdDialogRef.close(value);
  }
  public confirm() {
    this.close(true);
  }
  @HostListener('keydown.esc')
  public onEsc() {
    this.close(false);
  }

  public login() {
    this.isLoginPage = true;
    this.action['message'] = 'Login';
    this.ifLogin = false;
    TweenMax.to(this.Login.nativeElement, 0.4, {
      left: 0,
      opacity: 1,
      ease: Circ.easeOut,
    });
    TweenMax.to(this.Register.nativeElement, 0.3, {
      left: '100%',
      opacity: 0,
      ease: Circ.easeOut,
    });
    TweenMax.to(this.ForgotPWD.nativeElement, 0.3, {
      left: '100%',
      opacity: 0,
      ease: Circ.easeOut,
    });

    // if (this.formModel.captcha !== undefined) {
    //   this.isCaptchaVerified = true;
    // } else {
    //   this.isCaptchaVerified = false;
    // }
  }

  public createAccount() {
    this.isLoginPage = false;
    TweenMax.to(this.Register.nativeElement, 0.4, {
      left: 0,
      opacity: 1,
      ease: Circ.easeOut,
    });
    TweenMax.to(this.Login.nativeElement, 0.3, {
      left: '100%',
      opacity: 0,
      ease: Circ.easeOut,
    });
    TweenMax.to(this.ForgotPWD.nativeElement, 0.3, {
      left: '100%',
      opacity: 0,
      ease: Circ.easeOut,
    });
  }

  public forgotPassword() {
    this.isLoginPage = false;
    TweenMax.to(this.ForgotPWD.nativeElement, 0.4, {
      left: 0,
      opacity: 1,
      ease: Circ.easeOut,
    });
    TweenMax.to(this.Register.nativeElement, 0.3, {
      left: '100%',
      opacity: 0,
      ease: Circ.easeOut,
    });
    TweenMax.to(this.Login.nativeElement, 0.3, {
      left: '100%',
      opacity: 0,
      ease: Circ.easeOut,
    });
    this.checkMobileOnForgot();
  }

  public onTabKey($event) {
    $event.stopPropagation();
    $event.preventDefault();
  }

  skipMouseEnter($event) {
    $event.srcElement.querySelector('i').classList.remove('em-expressionless');
    $event.srcElement.querySelector('i').classList.remove('em-disappointed_relieved');
    $event.srcElement.querySelector('i').classList.add('em-disappointed');
  }

  skipMouseLeave($event) {
    $event.srcElement.querySelector('i').classList.remove('em-disappointed');
    $event.srcElement.querySelector('i').classList.add('em-expressionless');
  }

  skipLogin($event) {
    $event.srcElement.querySelector('i').classList.remove('em-disappointed');
    $event.srcElement.querySelector('i').classList.add('em-disappointed_relieved');
    if (this.loginType == 'Verify') {
      let data = this.action['data'];
      let pageName = this.action['title'];
      const model = utilities.generateProductInfoObject(data, pageName, null);
      this.shop(model, false);
    }
    setTimeout(() => {
      //this.storageService.setSessionStorage('userName', '_Guest_User_');
      this.confirm();
    }, 0);
  }

  public shop(model, isFirstTimeLogin) {
    // isFirstTimeLogin - to fix new window open issue for the first time login/signup. because new windows blocked by some browser when function callback instead of direct trigger
    this.searchService.postProductInfo(model).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        if (isFirstTimeLogin) {
          this.getUserProfile();
        }
      }
    },
      (err) => { }
    );
  }

  //Check if Mobile Already Registered
  public checkIfMobileRegistered() {
    this.showLoader = true;
    this.authService.checkIfMobileRegistered(this.mobileFormControl.value).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res.length > 0) {
        this.userId = res[0].chegCustomerId;
        this.storageService.setLocalStorage('chegUID', res[0].chegCustomerId);
        if (res[0].isExist) {
          this.showLoader = false;
          this.ifLogin = true;
          setTimeout(() => {
            this.password.nativeElement.focus();
          }, 500);
          //this.isCaptchaVerified = true;
        } else {
          this.showLoader = false;
          this.ifLogin = false;
          this.createAccount();
        }
      } else {
        this._snackBar.open('Something went wrong, Please try again later', '', {
          duration: 3000,
          panelClass: ['red-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.cancel();
      }
    },
      (err) => { }
    );
  }

  // public verifyIfBankOrRegistered() {
  //   this.showLoader = true;
  //   this.authService.checkIfMobileRegistered(this.mobileFormControl.value).pipe(takeUntil(this.destroy$)).subscribe((res) => {
  //     //console.log(res);
  //     if (res) {
  //       if (res.length > 0) {
  //         this.userId = res[0].chegCustomerId;
  //         this.storageService.setLocalStorage('chegUID', res[0].chegCustomerId);
  //         if (res[0].isExist) {
  //           if (res[0].mobileNo == this.mobileFormControl.value) {
  //             /** If the user is registered navigate to login page **/
  //             this.showLoader = false;
  //             this.ifLogin = true;
  //             setTimeout(() => {
  //               this.password.nativeElement.focus();
  //             }, 500);
  //           } else if ((res[0].mobileNo != this.mobileFormControl.value) && (res[0].isNewMobile)) {
  //             this._snackBar.open("You have previously registered with ******" + res[0].mobileNo?.substring(6, 10) + " number, Please use it", "", {
  //               duration: 5000,
  //               panelClass: ['red-snackbar'],
  //               horizontalPosition: 'center',
  //               verticalPosition: 'top',
  //             });
  //             this.mobileFormControl.reset();
  //             this.showLoader = false;
  //           } else {
  //             this._snackBar.open('Provided mobile number does not match with our records. Please enter your registered mobile number with the bank.', '', {
  //               duration: 5000,
  //               panelClass: ['red-snackbar'],
  //               horizontalPosition: 'center',
  //               verticalPosition: 'top',
  //             });
  //             this.mobileFormControl.reset();
  //             this.showLoader = false;
  //           }
  //         } else {
  //           if ((res[0].isVuserIdMatched) && (!res[0].isNewMobile)) {
  //             this.showLoader = false;
  //             this.ifLogin = false;
  //             this.createAccount();
  //             this.ifHideOTP = true;
  //             this.validOTP = true;
  //           } else if ((!res[0].isVuserIdMatched) && (res[0].isNewMobile)) {
  //             if(res[0].statusCode =='C01330'){
  //               Swal.fire({
  //                 title: 'More than one CIF Number',
  //                 text: res[0].msg+' Do you want continue?',
  //                 icon: 'warning',
  //                 showCancelButton: false,
  //                 showDenyButton: true,
  //                 confirmButtonText: 'Yes',
  //                 denyButtonText: 'No',
  //               }).then((result) => {
  //                 if (result.isDenied) {
  //                   this.showLoader = false;
  //                 } else if (result.isConfirmed) {
  //                   this.showLoader = false;
  //                   this.ifLogin = false;
  //                   this.createAccount();
  //                   this.ifHideOTP = false;
  //                   this.validOTP = false;
  //                 }
  //               })
  //             }else{
  //               Swal.fire({
  //                 title: 'Mobile number does not match',
  //                 text: 'Provided mobile number does not match the registered mobile number with the bank. Do you want continue?',
  //                 icon: 'warning',
  //                 showCancelButton: false,
  //                 showDenyButton: true,
  //                 confirmButtonText: 'Yes',
  //                 denyButtonText: 'No',
  //               }).then((result) => {
  //                 if (result.isDenied) {
  //                   this.showLoader = false;
  //                 } else if (result.isConfirmed) {
  //                   this.showLoader = false;
  //                   this.ifLogin = false;
  //                   this.createAccount();
  //                   this.ifHideOTP = false;
  //                   this.validOTP = false;
  //                 }
  //               })
  //             }
  //           } else {
  //             const bankUID = res[0].vuserId
  //             if (!bankUID || bankUID != '0' || bankUID != 0 || bankUID.toLowerCase() != 'null' || bankUID != '') {
  //               if (res[0].mobileNo == this.mobileFormControl.value) {
  //                 this.storageService.setLocalStorage('bankUID', bankUID);
  //                 this.verifyIfBankOrRegistered();
  //               }
  //             } else {
  //               this._snackBar.open('Provided mobile number does not match with our records. Please enter your registered mobile number with the bank.', '', {
  //                 duration: 3000,
  //                 panelClass: ['red-snackbar'],
  //                 horizontalPosition: 'center',
  //                 verticalPosition: 'top',
  //               });
  //               this.mobileFormControl.reset();
  //               this.showLoader = false;
  //             }

  //           }
  //         }
  //       } else {
  //         this._snackBar.open('Something went wrong, Please try again later', '', {
  //           duration: 3000,
  //           panelClass: ['red-snackbar'],
  //           horizontalPosition: 'center',
  //           verticalPosition: 'top',
  //         });
  //         this.cancel();
  //       }
  //     }
  //   },
  //     (err) => { }
  //   );
  // }

  public verifyIfBankOrRegistered() {
    this.showLoader = true;
    this.authService.checkIfMobileRegistered(this.mobileFormControl.value).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      //console.log(res);
      if (res) {
        if (res.length > 0) {
          this.userId = res[0].chegCustomerId;
          this.storageService.setLocalStorage('chegUID', res[0].chegCustomerId);
          if (res[0].isExist) {
            if (res[0].mobileNo == this.mobileFormControl.value) {
              /** If the user is registered navigate to login page **/
              this.showLoader = false;
              this.ifLogin = true;
              setTimeout(() => {
                this.password.nativeElement.focus();
              }, 500);
            } else if ((res[0].mobileNo != this.mobileFormControl.value) && (res[0].isNewMobile)) {
              this._snackBar.open("You have previously registered with ******" + res[0].mobileNo?.substring(6, 10) + " number, Please use it", "", {
                duration: 5000,
                panelClass: ['red-snackbar'],
                horizontalPosition: 'center',
                verticalPosition: 'top',
              });
              this.mobileFormControl.reset();
              this.showLoader = false;
            } else if ((res[0].isVuserIdMatched) && (!res[0].isNewMobile) && (utilities.isCanara() || utilities.isPNB())) { //handling canara
              this.showLoader = false;
              this.ifLogin = false;
              this.createAccount();
              this.ifHideOTP = true;
              this.validOTP = true;
            }else {
              this._snackBar.open('Provided mobile number does not match with our records. Please enter your registered mobile number with the bank.', '', {
                duration: 5000,
                panelClass: ['red-snackbar'],
                horizontalPosition: 'center',
                verticalPosition: 'top',
              });
              this.mobileFormControl.reset();
              this.showLoader = false;
            }
          } else {
            if ((res[0].isVuserIdMatched) && (!res[0].isNewMobile)) {
              this.showLoader = false;
              this.ifLogin = false;
              this.createAccount();
              this.ifHideOTP = true;
              this.validOTP = true;
            } else if ((!res[0].isVuserIdMatched) && (res[0].isNewMobile)) {
              if(res[0].statusCode =='C01330'){
                this._snackBar.open(res[0].msg, "", {
                  duration: 5000,
                  panelClass: ['red-snackbar'],
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                });
                this.mobileFormControl.reset();
                this.showLoader = false;
              }else{
                if(res[0].isAPIExist){ //handling ib isAPIEXist is true always for IB
                  Swal.fire({
                    title: 'Mobile number does not match',
                    text: 'Provided mobile number does not match the registered mobile number with the bank. Do you want continue?',
                    icon: 'warning',
                    showCancelButton: false,
                    showDenyButton: true,
                    confirmButtonText: 'Yes',
                    denyButtonText: 'No',
                  }).then((result) => {
                    if (result.isDenied) {
                      this.showLoader = false;
                    } else if (result.isConfirmed) {
                      this.showLoader = false;
                      this.ifLogin = false;
                      this.createAccount();
                      this.ifHideOTP = false;
                      this.validOTP = false;
                    }
                  })
                }else{ //handling canara
                  this.showLoader = false;
                  this.ifLogin = false;
                  this.createAccount();
                  this.ifHideOTP = true;
                  this.validOTP = true;
                }
              
              }
            } else {
              const bankUID = res[0].vuserId;
              console.log('bankuid print',bankUID);
              if ( bankUID!= false && bankUID != '0' && bankUID != 0 &&  bankUID != null &&   bankUID != '' ) {
                if(bankUID.toLowerCase() != 'null'){
                  console.log('bankuid before if');
                  if (res[0].mobileNo == this.mobileFormControl.value) {
                    this.storageService.setLocalStorage('bankUID', bankUID); 
                   let guestBankUID = utilities.getBankVIDURL();
                   console.log('guestBankUID',guestBankUID);
                  if(guestBankUID != null){
                    console.log('encdata is present');
                    this._snackBar.open('Provided mobile number is already registered with another CIF number.', '', {
                      duration: 3000,
                      panelClass: ['red-snackbar'],
                      horizontalPosition: 'center',
                      verticalPosition: 'top',
                    });
                    this.mobileFormControl.reset();
                    this.showLoader = false;
                  }else{
                    console.log('encdata is not present');
                    this.verifyIfBankOrRegistered();
                  }
                  }
                  console.log('bankuid after if');
                }
               
              } else {
                console.log('bankuid is null');
                this._snackBar.open('Provided mobile number does not match with our records. Please enter your registered mobile number with the bank.', '', {
                  duration: 3000,
                  panelClass: ['red-snackbar'],
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                });
                this.mobileFormControl.reset();
                this.showLoader = false;
              }

            }
          }
        } else {
          this._snackBar.open('Something went wrong, Please try again later', '', {
            duration: 3000,
            panelClass: ['red-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.cancel();
        }
      }
    },
      (err) => { }
    );
  }
  // public verifyIfBankOrRegisteredOld() {
  //   if (this.mobileFormControl.status == 'VALID') {
  //     this.showLoader = true;
  //     this.authService.checkIfMobileExistFromBank(this.mobileFormControl.value).pipe(takeUntil(this.destroy$)).subscribe((res) => {
  //       if (res.bankUserID !== null) {
  //         this.storageService.setLocalStorage('bankUID', res.bankUserID);
  //         this.storageService.setLocalStorage('mobileNumber', this.mobileFormControl.value);

  //         this.authService.updateChegUserId().pipe(takeUntil(this.destroy$)).subscribe((res) => {
  //           this.storageService.setLocalStorage('chegUID', res[0].chegCustomerId);
  //           this.storageService.setLocalStorage('bankUID', res[0].loginId);
  //           this.storageService.setLocalStorage('mobileNumber', res[0].mobileNo);

  //           this.storageService.setSessionStorage('accessToken', decodeURIComponent(res[0].token));
  //           this.storageService.setSessionStorage('refreshToken', decodeURIComponent(res[0].refreshToken));
  //           this.storageService.setSessionStorage('expireDate', res[0].expireDate);

  //           this.storageService.setSessionStorage('userName', '_Guest_User_');
  //           this.storageService.setSessionStorage('mobileNumber', res[0].mobileNo);
  //           this.storageService.setSessionStorage('bankUID', res[0].loginId);
  //           this.authService.setUserDetails('_Guest_User_', res[0].mobileNo, res[0].emailId, res[0].chegCustomerId);
  //           this.showLoader = false;
  //           this.getUserProfile();
  //           let data = this.action['data'];
  //           let pageName = this.action['title'];
  //           //this.shop(data, pageName);
  //           this.confirm();
  //         },
  //           (err) => { }
  //         );
  //       } else {
  //         this.showLoader = false;
  //         this._snackBar.open(
  //           'Provided mobile number does not match with our records.',
  //           '',
  //           {
  //             duration: 4000,
  //             panelClass: ['red-snackbar'],
  //             horizontalPosition: 'center',
  //             verticalPosition: 'top',
  //           }
  //         );
  //         this.createAccount();
  //       }
  //     },
  //       (err) => { }
  //     );
  //   }
  // }

  public checkMobileOnForgot() {
    this.showLoader = true;
    this.authService.checkMobileOnForgot(this.mobileFormControl.value, '').pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res.length > 0) {
        this.userId = res[0].chegCustomerId;
        this.storageService.setLocalStorage('chegUID', res[0].chegCustomerId);
        if (res[0].isExist) {
          this.showLoader = false;
        }
      }
    },
      (err) => { }
    );
  }

  //Login Click Event
  public cheggLogin() {
    console.log('this.mobileFormControl',this.mobileFormControl)
    console.log('this.pwdFormControl',this.pwdFormControl)
    if (
      this.mobileFormControl.status == 'VALID' &&
      this.pwdFormControl.status == 'VALID'
    ) {
      let wind;
      if (this.loginType == 'Verify') {
        wind = window.open('', '_blank');
      }

      this.showLoader = true;
      let pwd = CRYPTO.SHA512(this.pwdFormControl.value).toString();
      this.authService.loginBank(this.mobileFormControl.value, pwd).pipe(takeUntil(this.destroy$)).subscribe((res) => {
        if (res.length > 0) {
          this.storageService.setLocalStorage('chegUID', res[0].chegCustomerId);
          if (!utilities.isCallingBankAPI() || (utilities.isCanara() && !utilities.checkVirtualIdSessionId())) {
            this.storageService.setLocalStorage('bankUID', res[0].loginId);
          } else {
            this.storageService.setLocalStorage('bankUID', res[0].bankID);
          }
          this.storageService.setLocalStorage('mobileNumber', res[0].mobileNo);

          this.storageService.setSessionStorage('accessToken', decodeURIComponent(res[0].token));
          this.storageService.setSessionStorage('refreshToken', decodeURIComponent(res[0].refreshToken));
          this.storageService.setSessionStorage('expireDate', res[0].expireDate);
          if (this.loginType == 'Verify') {
            let data = this.action['data'];
            let pageName = this.action['title'];
            const model = utilities.generateProductInfoObject(data, pageName, wind);
            this.shop(model, true);
          } else {
            this.getUserProfile();
            this.createSessionInfo();
          }
        } else {
          this.showLoader = false;
          this._snackBar.open('Incorrect Mobile Number or Password', '', {
            duration: 3000,
            panelClass: ['red-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
      },
        (err) => { }
      );
    } else {
      this._snackBar.open('There are incomplete required fields. Please complete them', '', {
        duration: 3000,
        panelClass: ['red-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top',
      }
      );
    }

  }

  //Check OTP
  public validateOTP() {
    if (!this.isLoginPage) {
      this.showLoader = true;
      this.authService.checkIfPinExist(this.otpFormControl.value, this.userId).pipe(takeUntil(this.destroy$)).subscribe((res) => {
        this.otpTried = true;
        if (res == true) {
          this.validOTP = true;
        } else {
          this._snackBar.open('Enter Valid OTP', '', {
            duration: 3000,
            panelClass: ['red-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.validOTP = false;
        }
        this.showLoader = false;
      },
        (err) => { }
      );
    }
  }

  //Resend OTP
  public resendOTP(type: string) {
    this.showLoader = true;
    this.authService.resendOTP(this.mobileFormControl.value, this.userId, type).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res.result === true) {
        this.validOTP = false;
        this._snackBar.open('OTP Sent to ' + this.mobileFormControl.value, '', {
          duration: 3000,
          panelClass: ['yellow-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
      this.showLoader = false;
    },
      (err) => { }
    );
  }

  public signUp() {
    if (this.validOTP) {
      if (this.mobileFormControl.status == 'VALID' && this.setpwdFormControl.status == 'VALID' && this.nameFormControl.status == 'VALID' && this.emailFormControl.status == 'VALID') {
        let wind;
        if (this.loginType == 'Verify') {
          wind = window.open('', '_blank');
        }
        this.validOTP = false;
        this.showLoader = true;
        const model = {
          FirstName: this.nameFormControl.value,
          LastName: '',
          EmailId: this.emailFormControl.value,
          Password: CRYPTO.SHA512(this.setpwdFormControl.value).toString(),
          ChegCustomerId: this.userId,
          BankName: utilities.getBankName(),
          deviceType: 'WEB',
          MobileNo: this.mobileFormControl.value,
          UserName: this.mobileFormControl.value,
          LoginId: utilities.getBankID() == null ? 0 : utilities.getBankID()
        };
        this.authService.postUserInfo(model).pipe(takeUntil(this.destroy$)).subscribe((res) => {
          if (res) {
            this.storageService.setLocalStorage('chegUID', res[0].chegCustomerId);
            //this.storageService.setLocalStorage('bankUID', res[0].loginId);
            this.storageService.setLocalStorage('mobileNumber', res[0].mobileNo);

            this.storageService.setSessionStorage('accessToken', decodeURIComponent(res[0].token));
            this.storageService.setSessionStorage('refreshToken', decodeURIComponent(res[0].refreshToken));
            this.storageService.setSessionStorage('expireDate', res[0].expireDate);

            this._snackBar.open('Account created successfully', '', {
              duration: 3000,
              panelClass: ['green-snackbar'],
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
            this.validOTP = true;
            if (this.loginType == 'Verify') {
              let data = this.action['data'];
              let pageName = this.action['title'];
              const model = utilities.generateProductInfoObject(data, pageName, wind);
              this.shop(model, true);
            } else {
              this.getUserProfile();
              this.createSessionInfo();
            }
          }
        },
          (err) => { }
        );
      } else {
        this._snackBar.open('There are incomplete required fields. Please complete them', '', {
          duration: 3000,
          panelClass: ['red-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    } else {
      this._snackBar.open('Enter Valid OTP', '', {
        duration: 3000,
        panelClass: ['red-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      this.validOTP = false;
    }
  }

  //Forgot Update Password
  changePassword() {
    if (this.validOTP) {
      if (this.setpwdFormControl.status == 'VALID') {
        this.showLoader = true;
        let pwd = CRYPTO.SHA512(this.setpwdFormControl.value).toString();
        this.authService.updatePassword(pwd, this.userId, this.mobileFormControl.value, this.otpFormControl.value).pipe(takeUntil(this.destroy$)).subscribe((res) => {
          if (res.result == true) {
            this._snackBar.open('Password changed successfully', '', {
              duration: 3000,
              panelClass: ['blue-snackbar'],
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
            this.showLoader = false;
            this.login();
          }
        },
          (err) => { }
        );
      } else {
        this._snackBar.open(
          'There are incomplete required fields. Please complete them',
          '',
          {
            duration: 3000,
            panelClass: ['red-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top',
          }
        );
      }
    } else {
      this._snackBar.open('Enter Valid OTP', '', {
        duration: 3000,
        panelClass: ['red-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      this.validOTP = false;
    }
  }

  getUserProfile() {
    this.authService.getUserProfile().pipe(takeUntil(this.destroy$)).subscribe((res) => {
      //console.log(res)
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
      this.showLoader = false;
      this.close(true);
    },
      (err) => {
        this.cancel();
      }
    );
  }
  createSessionInfo(){
    let object={
      virtualId : this.storageService.getSessionStorage('bankUID')==null?0:this.storageService.getSessionStorage('bankUID'),
      bName: utilities.getBankName(),
      device: 'WEB'
    }
      this.authService.CreateSessionInfo(object).pipe(takeUntil(this.destroy$)).subscribe((res) => {
        if (res.success == true) {
          this.storageService.setSessionStorage('sessionId',res.sessionId);
        }
      })
  }
  public resolved(captchaResponse: string): void {
    //console.log(`Resolved response token: ${captchaResponse}`);
    if (captchaResponse) {
      if (this.mobileFormControl.status == 'VALID') {
        if (utilities.isCallingBankAPI() || (utilities.isCanara() && utilities.checkVirtualIdSessionId())) {
          this.verifyIfBankOrRegistered();
        } else {
          this.checkIfMobileRegistered();
        }
        this.captchaRef.reset();
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

  //// Lottie Animation Code
  // lottieCount: number = 1;
  // lottieTitle: string = 'Best Deals!';
  // lottieDesc: string = 'Don’t just count on it, discount on it.';
  // options: AnimationOptions = {
  //   path: '../../../../../assets/json/online-shopping.json'
  //   // path: '../../../../../assets/json/coupon.json'
  // };

  // styles: Partial<CSSStyleDeclaration> = {
  //   maxWidth: '500px',
  //   margin: '0',
  // };

  // animationCreated(animationItem: AnimationItem): void {
  //   //console.log(animationItem);
  // }

  // onLoopComplete(): void {
  //   // if (this.lottieCount == 0) {
  //   //   let el: HTMLElement = this.Coupon.nativeElement;
  //   //   el.click();
  //   // } else if (this.lottieCount == 1) {
  //   //   let el: HTMLElement = this.Compare.nativeElement;
  //   //   el.click();
  //   // } else if (this.lottieCount == 2) {
  //   //   let el: HTMLElement = this.Save.nativeElement;
  //   //   el.click();
  //   //   this.lottieCount = -1;
  //   // }
  //   // this.lottieCount = this.lottieCount + 1;
  // }

  // lottieCoupon(): void {
  //   this.lottieTitle = "Best Deals!";
  //   this.lottieDesc = 'Don’t just count on it, discount on it.'
  //   this.LottieNav.nativeElement.querySelector('li.active').classList.remove('active');
  //   this.LottieNav.nativeElement.querySelector('.coupon').classList.add('active');
  //   this.options = {
  //     path: '../../../../../assets/json/coupon.json',
  //   };
  // }

  // lottieCompare(): void {
  //   this.lottieTitle = "Compare!";
  //   this.lottieDesc = 'You heard it right! A smart escape, even smarter price.'
  //   this.LottieNav.nativeElement.querySelector('li.active').classList.remove('active');
  //   this.LottieNav.nativeElement.querySelector('.compare').classList.add('active');
  //   this.options = {
  //     path: '../../../../../assets/json/compare.json',
  //   };
  // }

  // lottieSave(): void {
  //   this.lottieTitle = "Shop!";
  //   this.lottieDesc = 'Affordable prices you cannot resist. Happy shopping! ';
  //   this.LottieNav.nativeElement.querySelector('li.active').classList.remove('active');
  //   this.LottieNav.nativeElement.querySelector('.save').classList.add('active');
  //   this.options = {
  //     path: '../../../../../assets/json/save.json',
  //   };
  // }
}
