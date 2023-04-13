import { Component, OnInit, ViewChild, ElementRef, Inject, HostListener, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as CRYPTO from 'crypto-js';

import { gsap, TweenMax, Circ } from 'gsap/all';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from '@core/services/auth.service';
import { StorageService } from '@core/services/storage.service';
import { SearchService } from '@app/core/services/search.service';
import { utilities } from '@utilities/utilities';
//import { FormModel } from '@app/core/core.module';
import { RecaptchaComponent } from 'ng-recaptcha';

gsap.registerPlugin(Circ);

function emailDomainValidator(control: FormControl) {
  if (utilities.getDomain() != null) {
    let email_domain = utilities.getDomain().toLowerCase();
    let email = control.value.toLowerCase();
    if (email && email.indexOf('@') != -1) {
      let [_, domain] = email.split('@');
      if (domain !== email_domain) {
        return {
          emailDomain: {
            parsedDomain: domain,
          },
        };
      }
    }
  }
  return null;
}
@Component({
  selector: 'app-login-dialog-corp',
  templateUrl: './login-dialog-corp.component.html',
  styleUrls: ['./login-dialog-corp.component.scss'],
})
export class LoginDialogCorpComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  userId: number;
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

  @ViewChild('Content') Content: ElementRef;
  @ViewChild('Login') Login: ElementRef;
  @ViewChild('Register') Register: ElementRef;
  @ViewChild('ForgotPWD') ForgotPWD: ElementRef;
  @ViewChild('captchaRef') captchaRef: RecaptchaComponent;
  @ViewChild('password') password: ElementRef;
  @ViewChild('emailID') emailID: ElementRef;
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
    emailDomainValidator,
  ]);

  constructor(
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
    private mdDialogRef: MatDialogRef<LoginDialogCorpComponent>
  ) {
    this.action = data;
  }

  ngOnInit(): void {
    this.loginType = this.action['message'];
    if (this.loginType == 'Login') {
      this.canSkip = false;
    } else if (this.loginType == 'Verify') {
      this.canSkip = true;
    }
    setTimeout(() => {
      this.emailID.nativeElement.focus();
    }, 500);
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
    this.checkEmailOnForgot();
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
      this.shop(model, false, '');
    }
    setTimeout(() => {
      //this.storageService.setSessionStorage('userName', '_Guest_User_');
      this.confirm();
    }, 0);
  }

  public shop(model, isFirstTimeLogin, action) {
    // isFirstTimeLogin - to fix new window open issue for the first time login/signup. because new windows blocked by some browser when function callback instead of direct trigger
    this.searchService.postProductInfo(model).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res) {
        if (isFirstTimeLogin) {
          this.getUserProfile(action);
        }
      }
    },
      (err) => { }
    );
  }

  //Check if Email Already Registered
  public checkIfEmailRegistered() {
    this.showLoader = true;
    this.authService.checkIfEmailRegistered(this.emailFormControl.value).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      //console.log(res);
      if (res) {
        this.userId = res.chegCustomerId;
        this.storageService.setLocalStorage('chegUID', res.chegCustomerId);
        this.storageService.setSessionStorage('accessToken', decodeURIComponent(res.token));
        if (res.registered) {
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
      }
    },
      (err) => { }
    );
  }

  public checkEmailOnForgot() {
    this.showLoader = true;
    this.authService.checkEmailOnForgot(this.emailFormControl.value, this.userId).pipe(takeUntil(this.destroy$)).subscribe((res) => {
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
    if (
      this.emailFormControl.status == 'VALID' &&
      this.pwdFormControl.status == 'VALID'
    ) {
      let wind;
      if (this.loginType == 'Verify') {
        wind = window.open('', '_blank');
      }
      this.showLoader = true;
      let pwd = CRYPTO.SHA512(this.pwdFormControl.value).toString();
      this.authService.loginCorp(this.emailFormControl.value, pwd).pipe(takeUntil(this.destroy$)).subscribe((res) => {
        //console.log(res);
        if (res.list.length > 0) {
          this.storageService.setLocalStorage('chegUID', res.list[0].chegCustomerId);
          this.storageService.setLocalStorage('bankUID', res.list[0].loginId);
          this.storageService.setLocalStorage('mobileNumber', res.list[0].mobileNo);
          this.storageService.setLocalStorage('emailID', res.list[0].emailID);

          this.storageService.setSessionStorage('accessToken', decodeURIComponent(res.list[0].token));
          this.storageService.setSessionStorage('refreshToken', decodeURIComponent(res.list[0].refreshToken));
          this.storageService.setSessionStorage('expireDate', res.list[0].expireDate);

          if (this.loginType == 'Verify') {
            let data = this.action['data'];
            let pageName = this.action['title'];
            const model = utilities.generateProductInfoObject(data, pageName, wind);
            this.shop(model, true, 'login');
          } else {
            this.getUserProfile('login');
            this.createSessionInfo();
          }
        } else {
          this.showLoader = false;
          this._snackBar.open('Incorrect Email Id or Password', '', {
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
        }
        );
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
          UserName: this.emailFormControl.value,
        };
        this.authService.postUserInfo(model).pipe(takeUntil(this.destroy$)).subscribe((res) => {
          if (res) {
            this.storageService.setLocalStorage('chegUID', res[0].chegCustomerId);
            this.storageService.setLocalStorage('bankUID', res[0].loginId);
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
              this.shop(model, true, 'registered');
            } else {
              this.getUserProfile('registered');
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

  //Forgot Update Password
  changePassword() {
    if (this.validOTP) {
      if (this.setpwdFormControl.status == 'VALID') {
        this.showLoader = true;
        let pwd = CRYPTO.SHA512(this.setpwdFormControl.value).toString();
        this.authService.updatePassword(pwd, this.userId, this.emailFormControl.value, this.otpFormControl.value).pipe(takeUntil(this.destroy$)).subscribe((res) => {
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
        this._snackBar.open('There are incomplete required fields. Please complete them', '', {
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

  getUserProfile(action: string) {
    this.authService.getUserProfile().pipe(takeUntil(this.destroy$)).subscribe((res) => {
      this.storageService.setSessionStorage('userName', res[0].firstName);
      this.storageService.setSessionStorage(
        'mobileNumber',
        res[0].mobileNo
      );
      this.storageService.setSessionStorage('emailID', res[0].emailId);
      //added for login flow
      this.storageService.setLocalStorage('userName', res[0].firstName);
      this.storageService.setLocalStorage('mobileNumber', res[0].mobileNo);
      this.storageService.setLocalStorage('emailID', res[0].emailId);
      //added for login flow
      this.authService.setUserDetails(res[0].firstName, res[0].mobileNo, res[0].emailId, res[0].chegCustomerId);
      this.storageService.setLocalStorage('loggedOut', false);
      this.showLoader = false;
      this.close(action);
    },
      (err) => {
        this.cancel();
      }
    );
  }

  public resolved(captchaResponse: string): void {
    if (captchaResponse) {
      if (this.emailFormControl.status == 'VALID') {
        this.checkIfEmailRegistered();
        this.captchaRef.reset();
      }
    }
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

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
