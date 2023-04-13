import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { DialogService } from '@core/services/dialog.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { utilities } from '@utilities/utilities';
import { impressionData } from '@app/shared/models/impression-data';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() paymentData;
  @Input() removeClass;
  @Input() type;
  @Input() giftCardName;
  @Output() paymentEvent = new EventEmitter<object>();
  @Output() previewEvent = new EventEmitter<boolean>();
  @ViewChild('btnCheckout', { read: ElementRef }) btnCheckout: ElementRef;// use , { read: ElementRef } otherwise it wont work

  userLoggedIn: boolean = false;
  isReward: boolean = false;
  totalAmount: number = 0;
  finalTotal: number = 0;
  processingFee: number = 0;
  processingAmount: number = 0;
  processingAmountDummy: number = 0;
  payableAmount: number = 0;
  walletBalance: number = 0;
  fromWalletBalance: number = 0;
  eWalletMethod = new FormControl('');
  paymentMethod = new FormControl('');
  giftCardDiscount: number = 0;
  savings: number = 0;
  paymentModes = {};

  customFormControl = new FormControl(0);

  giftCardAmount;
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.isReward = this.authService.isReward;
    this.userLoggedIn = this.authService.isAuthenticated();

    if (this.isReward) {
      this.getWalletBalance();
    }
  }

  ngOnChanges() {
    if (!utilities.isObjectEmpty(this.paymentData)) {
      //console.log(this.paymentData)
      this.eWalletMethod.setValue('');
      this.fromWalletBalance = 0;

      this.totalAmount = +this.paymentData['totalAmount'];
      this.processingFee = +this.paymentData['processingFee'];
      let discount = this.paymentData['giftCardDiscount'];
      this.giftCardDiscount = +(discount).toFixed(2);
      this.paymentModes = this.paymentData['paymentModes'];
      
      let proFee = this.processingFee / 100;
      let TotalProFee = (this.totalAmount * proFee).toFixed(2);
      this.processingAmount = +TotalProFee;
      this.payableAmount = this.totalAmount + this.processingAmount;
      this.finalTotal = this.totalAmount;


      if (this.processingAmount === 0) {
        this.processingAmountDummy = +(this.totalAmount * 0.02).toFixed(2);
      }

      this.savings = +(this.giftCardDiscount + this.processingAmountDummy).toFixed(2);

      if (this.removeClass) {
        this.btnCheckout.nativeElement.classList.remove('active');
      }
    }
  }

  getWalletBalance() {
    this.userService.getRedeemBalance().pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.length > 0) {
        this.walletBalance = res[0].walletBalance;
        this.customFormControl.setValidators([Validators.required, Validators.max(this.walletBalance)])
      }
    }, err => {
    });
  }

  selectWalletBalance(amt: number) {
    if (amt > this.totalAmount) {
      amt = this.totalAmount;
    }
    let totalAmount = this.totalAmount;
    this.finalTotal = +(totalAmount - amt).toFixed(2);
    let proFee = this.processingFee / 100;
    let TotalProFee = (this.finalTotal * proFee).toFixed(2);
    this.processingAmount = +TotalProFee;
    let pa = this.finalTotal + this.processingAmount;
    this.payableAmount = +pa.toFixed(2);
    if (this.payableAmount < 0) {
      this.payableAmount = 0;
    }

    if (this.processingAmount === 0) {
      this.processingAmountDummy = +(this.finalTotal * 0.02).toFixed(2);
    }
    this.savings = +(this.giftCardDiscount + this.processingAmountDummy).toFixed(2);

    setTimeout(() => {
      if (this.eWalletMethod.value == 'custom') {
        if (this.customFormControl.value == 0) {
          this.fromWalletBalance = 0
        } else {
          this.fromWalletBalance = this.customFormControl.value
        }
      } else {
        if (this.walletBalance > this.totalAmount) {
          this.fromWalletBalance = this.totalAmount
        } else {
          this.fromWalletBalance = this.walletBalance
        }
      }
    }, 250);
  }

  onCustomKeyUp(event) {
    if (this.walletBalance < this.customFormControl.value) {
      this.customFormControl.setValue(0);
    }
    this.payableAmount = this.totalAmount - this.customFormControl.value;
    if (this.payableAmount < 0) {
      this.customFormControl.setValue(this.totalAmount);
      this.payableAmount = 0;
    }
    this.fromWalletBalance = this.customFormControl.value;

    let totalAmount = this.totalAmount;
    this.finalTotal = +(totalAmount - this.customFormControl.value).toFixed(2);
    let proFee = this.processingFee / 100;
    let TotalProFee = (this.finalTotal * proFee).toFixed(2);
    this.processingAmount = +TotalProFee;
    let pa = this.finalTotal + this.processingAmount;
    this.payableAmount = +pa.toFixed(2);
    if (this.payableAmount < 0) {
      this.payableAmount = 0;
    }
  }

  checkoutMouseEnter($event) {
    if (this.customFormControl.value == '' || this.customFormControl.value == null) {
      this.customFormControl.setValue(0);
    }
  }

  checkout($event) {
    this.onVisible();
    if (this.authService.isLoggedIn()) {
      this.sendPaymentInfo();
    } else {
      utilities.addHTMLClass(['login_page']);
      const options = {
        title: 'Checkout',
        message: 'Login',
        cancelText: 'Cancel',
        confirmText: 'Confirm'
      };
      this.dialogService.openLogin(options);
      this.dialogService.loginConfirmed().subscribe(confirmed => {
        //console.log(confirmed)
        if (confirmed) {
          this.sendPaymentInfo();
        }
        utilities.removeHTMLClass(['login_page']);
      });
    }
  }

  sendPaymentInfo() {
    this.btnCheckout.nativeElement.classList.add('active');
    let object = {};
    object['payableAmount'] = this.payableAmount;
    object['fromWalletBalance'] = this.fromWalletBalance;
    object['paymentMethod'] = this.paymentMethod.value;
    object['processingAmount'] = this.processingAmount;
    this.paymentEvent.emit(object)
  }

  sendPreview() {
    this.previewEvent.emit(true)
  }

  login() {
    utilities.addHTMLClass(['login_page']);
    const options = {
      title: 'Login',
      message: 'Login',
      cancelText: 'Cancel',
      confirmText: 'Confirm'
    };
    this.dialogService.openLogin(options);
    this.dialogService.loginConfirmed().subscribe(confirmed => {
      //console.log(confirmed)
      if (confirmed) {
        this.userLoggedIn = this.authService.isAuthenticated()
        this.getWalletBalance()
      }
      utilities.removeHTMLClass(['login_page']);
    });
  }

  preview($event) {
    // $event.preventDefault();
    // let elem = this.previewBlock.nativeElement
    // TweenMax.to(elem, .2, { left: '0', opacity: 1, ease: Circ.easeOut });
  }
  onVisible() {
    //console.log(type, data);
    let arrayObj = new impressionData();
    arrayObj.type = 'Click';
    arrayObj.page_name ='buy_now_giftcard_page';
    arrayObj.section = 'Gift Cards';
    arrayObj.idType='buy_now_checkout';
    arrayObj.name = this.giftCardName;
    //console.log(arrayObj)
    utilities.saveImpressionDetails(arrayObj);
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
