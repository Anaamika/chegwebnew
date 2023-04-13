import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { utilities } from '@utilities/utilities';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '@core/services/auth.service';
import { StorageService } from '@core/services/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';

function confirmMobileValidator(control: FormControl) {
  let valOld = utilities.getMobNumber();
  let val = control.value.toLowerCase();
  if (val == valOld) {
    return {
      confirmMobile: {
        mobNumber: val,
      },
    };
  }
  return null;
}

function confirmEmailValidator(control: FormControl) {
  let valOld = utilities.getEmail();
  let val = control.value.toLowerCase();
  if (val == valOld) {
    return {
      confirmEmail: {
        email: val,
      },
    };
  }
  return null;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  oldEmail: string = utilities.getEmail();
  showLoader: boolean = false;
  validOTP: boolean = false;
  otpTried: boolean = false;
  userId = utilities.getChegUID();

  editMobile: boolean = false;
  editEmail: boolean = false;
  sentOTP: boolean = false;
  editName: boolean = false;

  nameFormControl = new FormControl();
  newNameFormControl = new FormControl('', [Validators.required]);
  mobileFormControl = new FormControl();

  newMobileFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[0-9]*$'),
    Validators.minLength(10),
    confirmMobileValidator
  ]);

  emailFormControl = new FormControl();
  newEmailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
    confirmEmailValidator
  ]);
  otpFormControl = new FormControl('');

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.nameFormControl.setValue(utilities.getName());
    this.mobileFormControl.setValue(utilities.getMobNumber());
    this.emailFormControl.setValue(this.oldEmail)
    this.nameFormControl.disable();
    this.mobileFormControl.disable();
    this.emailFormControl.disable();
  }

  public edit_Mobile() {
    this.editMobile = true;
    this.editEmail = false;
    this.newMobileFormControl.enable();
  }

  public cancel_Mobile() {
    this.editMobile = false;
    this.sentOTP = false;
    this.newMobileFormControl.setValue('');
  }

  public edit_Email() {
    this.editEmail = true;
    this.editMobile = false;
    this.newEmailFormControl.enable();
  }

  public cancel_Email() {
    this.editEmail = false;
    this.sentOTP = false;
    this.newEmailFormControl.setValue('');
  }

  public validateOTP() {
    this.showLoader = true;
    this.authService.checkIfPinExist(this.otpFormControl.value, this.userId).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      //console.log(res)
      this.otpTried = true;
      if (res == true) {
        this.validOTP = true;
        this.otpFormControl.disable();
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

  public sendOTP(type: string) {
    this.showLoader = true;
    this.authService.sendOTP(this.newMobileFormControl.value, this.userId, type).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      //console.log(res)
      if (res === 1) {
        this.sentOTP = true;
        this.validOTP = false;
        this.newMobileFormControl.disable();
        this._snackBar.open('OTP Sent to ' + this.newMobileFormControl.value, '', {
          duration: 3000,
          panelClass: ['yellow-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.otpFormControl.enable();
        this.otpFormControl.setValue('');
      } else if (res === 2) {
        this._snackBar.open('This mobile number is already in use', '', {
          duration: 3000,
          panelClass: ['red-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.newMobileFormControl.setValue('');
      } else {
        this._snackBar.open('Something went wrong, Please try again later', '', {
          duration: 3000,
          panelClass: ['red-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.newMobileFormControl.setValue('');
        this.cancel_Mobile();
      }
      this.showLoader = false;
    },
      (err) => { }
    );
  }

  public edit_Name(){
    this.editName = true;
    this.editEmail = false;
    this.editMobile = false;
    this.newNameFormControl.enable();
  }
  public cancel_Name() {
    this.editName = false;
    this.newNameFormControl.setValue('');
  }

  updateMobile() {
    this.showLoader = true;
    const model = {
      OldMobileNo: this.mobileFormControl.value,
      NewMobileNo: this.newMobileFormControl.value,
      OldEmailId: '',
      NewEmailId: '',
      OTP: this.otpFormControl.value,
      BankName: utilities.getBankName(),
      ChegCustomerId: utilities.getChegUID() == null ? 0 : utilities.getChegUID(),
    };
    //console.log(model)
    this.authService.updateMobile(model).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      //console.log(res)
      if (res == 0) {
        this._snackBar.open('Mobile number updated successfully', '', {
          duration: 3000,
          panelClass: ['green-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.mobileFormControl.setValue(this.newMobileFormControl.value)
        this.storageService.setLocalStorage('mobileNumber', this.newMobileFormControl.value);
        this.authService.setUserDetails(null, this.newMobileFormControl.value, null, null);
        this.newMobileFormControl.setValue('');
        this.cancel_Mobile();
      } else if(res == 1) {
        this._snackBar.open('Pin is invalid', '', {
          duration: 3000,
          panelClass: ['red-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.newMobileFormControl.setValue('');
        this.cancel_Mobile();
      }
      else if(res == 2) {
        this._snackBar.open('Entered mobile number is already registered.', '', {
          duration: 3000,
          panelClass: ['red-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.newMobileFormControl.setValue('');
        this.cancel_Mobile();
      }
      this.showLoader = false;
    },
      (err) => { }
    );
  }

  updateEmail() {
    this.showLoader = true;
    const model = {
      OldMobileNo: '',
      NewMobileNo: '',
      OldEmailId: this.oldEmail,
      NewEmailId: this.newEmailFormControl.value,
      OTP: '',
      BankName: utilities.getBankName(),
      ChegCustomerId: utilities.getChegUID() == null ? 0 : utilities.getChegUID(),
    };
    //console.log(model)
    this.authService.updateEmail(model).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      //console.log(res)
      if (res) {
        this._snackBar.open('Email updated successfully', '', {
          duration: 3000,
          panelClass: ['green-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.emailFormControl.setValue(this.newEmailFormControl.value)
        this.storageService.setLocalStorage('emailID', this.newEmailFormControl.value);
        this.authService.setUserDetails(null, null, this.newEmailFormControl.value, null);
        this.newEmailFormControl.setValue('');
        this.cancel_Email();
      }
      this.showLoader = false;
    },
      (err) => { }
    );
  }

  updateName(){
    this.showLoader = true;
    const model = {
      FirstName:this.newNameFormControl.value,
      BankName: utilities.getBankName(),
    };
    //console.log(model)
    this.authService.updateName(model).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      //console.log(res)
      if (res) {
        this._snackBar.open('Name updated successfully', '', {
          duration: 3000,
          panelClass: ['green-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.nameFormControl.setValue(this.newNameFormControl.value)
        this.storageService.setLocalStorage('userName', this.newNameFormControl.value);
        this.authService.setUserDetails(this.newNameFormControl.value, null, null, null);
        this.newNameFormControl.setValue('');
        this.cancel_Name();
      }
      this.showLoader = false;
    },
      (err) => { }
    );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
