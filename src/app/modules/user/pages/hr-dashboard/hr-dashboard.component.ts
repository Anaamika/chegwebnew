import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { StorageService } from '@core/services/storage.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, from } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';
import { utilities } from '@utilities/utilities';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
// import { DialogService } from '@core/services/dialog.service';

function emailDomainValidator(control: FormControl) {
  let email_domain = utilities.getDomain().toLowerCase();
  let email;
  if (control.value) {
    email = control.value.toLowerCase();
  }
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
  return null;
}

@Component({
  selector: 'app-hr-dashboard',
  templateUrl: './hr-dashboard.component.html',
  styleUrls: ['./hr-dashboard.component.scss'],
})
export class HrDashboardComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  bankFullName = utilities.getBankFullName();
  employees: Array<object> = [];
  //corpLedger: Array<object> = [];
  corpUserLedger: Array<object> = [];
  //corpGiftCardsDetails: Array<object> = [];
  showLoader: boolean = false;
  isMRESULTpoint: boolean = false;
  corpRewardBalance: number = 0;
  awardsList: string[] = [];
  contactEmail: string = '';
  contactNumber: string = '';
  bankName= utilities.getBankName();
  //currentDate = new Date();
  //rewardsAwarded: number = 0;

  //displayedColumns: string[] = ['orderId', 'refNo', 'senderEmail', 'amount', 'productName', 'createdDate'];

  //displayedColumns1: string[] = ['awardTitle', 'corpName', 'corpUserId', 'action'];


  name: string = '';
  emailID: string = '';
  chegCustomerID: any;

  bank = utilities.getBankName();
  type = utilities.getType();

  encryptSecretKey = "MAKV2SPBNI99212";

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
    emailDomainValidator
  ]);

  awardsFormControl = new FormControl('', [
    Validators.required,
  ]);

  rewardFormControl = new FormControl('');
  userData: Array<object> = [];

  constructor(
    private userService: UserService,
    private storageService: StorageService,
    // private dialogService: DialogService,
    private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.getCorpRewardDetails();
    this.getCorpAwards();
    //this.getCorpLedger();
    this.getCorpUserLedger();

    this.userData = this.userService.userData;
    if (this.userData.length == 0) {
      this.getAllUserData();
    }

    if (this.bankName === 'MRESULT') {
      this.isMRESULTpoint = true;
    } else {
      this.isMRESULTpoint = false;
    }
    //if(this.userData.length)
    //this.getCorpGiftCardDetails();
  }



  onKeyUp($event) {
    $event.stopPropagation();
    $event.preventDefault();
    if(this.userData.length>0){
      let email = this.emailFormControl.value.toLowerCase();
      this.getUsersByEmailID(email);
    }else{
      this._snackBar.open('Please wait', '', {
        duration: 2000,
        panelClass: ['red-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
    
  }



  focusOut($event) {
    $event.stopPropagation();
    $event.preventDefault();
    if (this.emailFormControl.status == "VALID") {
      let email = this.emailFormControl.value.toLowerCase();

      if (this.chegCustomerID === 0) {
        let data = this.userData.filter(item => item['emailId'].toLowerCase() == email);
        if (data.length) {
          this.chegCustomerID = data[0]['chegCustomerId'];
          this.name = data[0]['firstName'];
        } else {
          this.chegCustomerID = 0;
          let str = email.substring(0, email.indexOf("@"));
          this.name = str.split('.')[0];
        }
      }
    }
  }

  displayFn(emp: any): string {
    return emp && emp.emailId ? emp.emailId : '';
  }

  // getUsersByEmailID(email) {
  //   const model = {
  //     email: email,
  //     bName: this.bank,
  //     chegCustomerId: 0,
  //   };
  //   let jsonArray = [];
  //   this.userService.getUsersByEmailID(model).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
  //     if (res.length > 0) {
  //       jsonArray = utilities.getUniqueJasonObj(res, it => it.emailId);
  //       this.employees = jsonArray;
  //     }
  //   }, (err) => { }
  //   );
  //   this.emailID = '';
  //   this.chegCustomerID = 0;
  // }

  getUsersByEmailID(email) {
    let jsonArray = [];
    jsonArray = this.userData.filter(item => item['emailId'].toLowerCase().includes(email.trim()))
    console.log(jsonArray,'jsonArray');
    this.employees = jsonArray;
    this.emailID = '';
    this.chegCustomerID = 0;
  }

  getEmpDetails(emp) {
    this.name = emp.firstName;
    this.emailID = emp.emailId;
    this.chegCustomerID = emp.chegCustomerId;
    console.log('emp')
  }

  submitEmployeeRewards() {
      if (this.emailFormControl.status == "VALID" && this.awardsFormControl.status == "VALID" && this.rewardFormControl.status == "VALID") {
        this.showLoader = true;
  
        if (this.emailID == '' || this.emailID == null) {
          this.emailID = this.emailFormControl.value;
        }
  
        if (this.chegCustomerID != 0) {
          this.chegCustomerID = this.encryptData(JSON.stringify(this.chegCustomerID))
        }
          const model = {
            email: this.emailID,
            name: capitalizeFirstLetter(this.name),
            title: this.awardsFormControl.value,
            bName: this.bank,
            chegCustomerId: this.chegCustomerID,
            rewardPoint: this.rewardFormControl.value
          };
    
          //console.log(model)
    
          this.userService.submitEmployeeRewards(model).pipe(takeUntil(this.destroy$)).subscribe((res) => {
            //console.log(res)
            if (res.isStored) {
    
              Swal.fire({
                title: 'Reward points sent successfully',
                icon: 'success',
                confirmButtonText: 'Continue',
                allowOutsideClick: false
              }).then((result) => {
                if (result.isConfirmed) {
                  this.showLoader = false;
                  this.awardsFormControl.reset();
                  this.rewardFormControl.reset();
                  this.emailFormControl.reset();
                }
              })
              this.corpRewardBalance = res.corpRewardPointBalance;
              this.getCorpUserLedger();
            }
          },
            (err) => { }
          );
        } else {
          this._snackBar.open('Please enter valid data and submit again', '', {
            duration: 2000,
            panelClass: ['red-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
        }
  }

  trackByEmailID(item) {
    return item.emailId;
  }

  encryptData(msg) {
    var keySize = 256;
    var salt = CryptoJS.lib.WordArray.random(16);
    var key = CryptoJS.PBKDF2(this.encryptSecretKey, salt, {
      keySize: keySize / 32,
      iterations: 100
    });

    var iv = CryptoJS.lib.WordArray.random(128 / 8);

    var encrypted = CryptoJS.AES.encrypt(msg, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    var result = CryptoJS.enc.Base64.stringify(salt.concat(iv).concat(encrypted.ciphertext));

    return result;
  }

  getCorpRewardDetails() {
    this.userService.getCorpRewardDetails().pipe(takeUntil(this.destroy$)).subscribe(res => {
      //console.log('corp Awards')
      //console.log(res)
      if (res.length > 0) {
        this.contactEmail = res[0].contactEmailId;
        this.contactNumber = res[0].contactNumber;
        this.corpRewardBalance = res[0].corpRewardBalance;

        this.rewardFormControl.setValidators([
          Validators.required,
          Validators.pattern("^[0-9]*$"),
          Validators.min(1),
          Validators.max(this.corpRewardBalance)]);
        this.rewardFormControl.updateValueAndValidity();
      }
    }, err => {
    });
  }

  getCorpAwards() {
    this.userService.getCorpAwards().pipe(takeUntil(this.destroy$)).subscribe(res => {
      //console.log('corp Awards')
      //console.log(res)
      if (res.length > 0) {
        this.awardsList = res;
      }
    }, err => {
    });
  }

  // getCorpLedger() {
  //   this.userService.getCorpLedger().pipe(takeUntil(this.destroy$)).subscribe(res => {
  //     //console.log('corp Ledger')
  //     //console.log(res)
  //     if (res.length > 0) {
  //       this.corpLedger = res;
  //     }
  //   }, err => {
  //   });
  // }

  getCorpUserLedger() {
    this.userService.getCorpUserLedger().pipe(takeUntil(this.destroy$)).subscribe(res => {
      //console.log('corp User Ledger')
      //console.log(res)
      if (res.length > 0) {
        this.corpUserLedger = res.slice(0, 4);
        // for (let i = 0; i < res.length; i++) {
        //   let debit = +res[i]['debit'];
        //   this.rewardsAwarded = this.rewardsAwarded + debit;
        // }
      }
    }, err => {
    });
  }

  // getCorpGiftCardDetails() {
  //   this.userService.getCorpGiftCardDetails().pipe(takeUntil(this.destroy$)).subscribe(res => {
  //     //console.log('corp Gift Card Details')
  //     //console.log(res)
  //     if (res.length > 0) {
  //       this.corpGiftCardsDetails = res.slice(0, 4);;
  //     }
  //   }, err => {
  //   });
  // }

  getAllUserData() {
    this.userService.getAllUserData().pipe(takeUntil(this.destroy$)).subscribe(res => {
      //console.log('corp Awards')
      //console.log(res)
      if (res.length > 0) {
        this.userData = res;
      }
    }, err => {
    });
  }


  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
