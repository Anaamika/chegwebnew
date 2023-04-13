import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject, from } from 'rxjs';
import { GiftsService } from '@core/services/gifts.service';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { WindowRefService } from '@core/services/window-ref.service';
import { utilities } from '@utilities/utilities';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { giftThemesMockData } from '@shared/mock/gift-theme-data';
import { gsap, TweenMax, Circ } from "gsap/all";
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { impressionData } from '@app/shared/models/impression-data';

gsap.registerPlugin(Circ);
@Component({
  selector: 'app-buy-gift-card',
  templateUrl: './buy-gift-card.component.html',
  styleUrls: ['./buy-gift-card.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class BuyGiftCardComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  giftCardData: any = [];
  bank = utilities.getBankName();
  isBandhan:boolean = this.bank =='BANDHAN'?true:false;
  giftCardId: number;
  giftCardImage: string = '';
  giftCardName: string = '';
  giftCardExpiry: string = '';
  giftCardOffer: string = '';
  giftCardSKU: string = '';
  giftCardCurrency: number;
  giftCardDescription: string = '';
  giftCardTerms: string = '';
  giftCardTermsLink: string = '';
  giftHowToRedeem: string = '';
  giftCardOfferValue: number = 0;
  giftCardDiscount: number = 0;
  giftCardAmount: number = 0;
  processingFee: number = 0;
  processingAmount: number = 0;

  giftCardTheme: Array<object> = [];
  themeImage: string = '';

  isSale: boolean = false;
  totalAmount: number = 0;
  payableAmount: number = 0;
  fromWalletBalance: number = 0;
  paymentMethod: string;
  paymentModes = {
    netbanking: "1",
    card: "1",
    upi: "1",
    wallet: "1",
    emi: "1"
  };

  orderId = '';
  razorPayKey: string = '';
  razorpayOrderId = '';
  razorpayPaymentId = '';
  razorpaySignature = '';

  giftCardAmountData = {};
  paymentData = {};
  runConfetti: boolean = false;
  removeClass: boolean = false;
  isRedeem: boolean = false;

  @ViewChild('previewBlock') previewBlock: ElementRef;
  @ViewChild('themeGrid') themeGrid: ElementRef;

  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private giftsService: GiftsService,
    private authService: AuthService,
    private userService: UserService,
    private winRef: WindowRefService
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      const parm = this.route.snapshot.paramMap.get('isRedeem');

      var isTrueSet = (parm === 'true');
      if (isTrueSet) {
        const navigation = this.router.getCurrentNavigation();

        if (navigation.extras.state) {
          this.isRedeem = navigation.extras.state.isRedeem;
        } else {
          this.router.navigate(["account/redeem/"]);
        }
      }

      this.giftsService.getRazorPayKey().pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res) {
          this.razorPayKey = res.razorKey;
        }
      }, err => {
      });

      this.giftCardId = +this.route.snapshot.paramMap.get('gcID');
      this.giftCardData = this.giftsService.getGiftCardDetail(this.giftCardId);
      //console.log(this.giftCardData)

      if (this.giftCardData !== undefined) {
        this.confirmIfSale();
      } else {
        this.giftsService.getGiftCardByID(this.giftCardId)
          .pipe(takeUntil(this.destroy$)).subscribe(res => {
            if (res.length > 0) {
              //console.log(res)
              this.giftCardData = res[0];
              this.confirmIfSale();
            }
          }, err => {
          });
      }
    });
  }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      //firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      nameFormControl: ['', Validators.required],
      mobileFormControl: ['', [Validators.required, Validators.minLength(10)]],
      emailFormControl: ['', [Validators.required, Validators.email]],
      messageFormControl: ['Best Wishes', Validators.required],
      senderFormControl: [this.authService.userName, Validators.required]
    });
    this.fourthFormGroup = this._formBuilder.group({
    });
  }

  confirmIfSale() {
    if (!this.isRedeem) {
      if (this.giftCardData['isSale']) {
        let endDate = new Date(this.giftCardData['endDate']);
        let timeDiff = endDate.getTime() - new Date().getTime();
        if (timeDiff < 0) {
          this.giftCardData['isSale'] = false;
        }
        this.getGiftCardDetail();
      } else {
        this.getGiftCardDetail();
      }
    this.onVisible();
    } else {
      this.onVisible();
      this.getGiftCardDetail();
    }
  }

  public GetRouterLink() {
    if (utilities.getBankName() == 'MRESULT' || utilities.getBankName() == 'BFSL' ) { return '/account/redeem' }
    else { return '/' }
  }

  preview(flag) {
    if (flag == true) {
      let elem = this.previewBlock.nativeElement
      TweenMax.to(elem, .2, { left: '0', opacity: 1, ease: Circ.easeOut });
    }
  }

  continue($event) {
    $event.preventDefault();
    let elem = this.previewBlock.nativeElement;
    TweenMax.to(elem, .2, { left: '120vw', opacity: 0, ease: Circ.easeOut });
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView({ behavior: 'smooth' });
  }

  getGiftCardDetail() {
    this.giftCardImage = this.giftCardData['s_Images'];
    this.giftCardName = this.giftCardData['productName'];
    this.giftCardExpiry = this.giftCardData['expiry'];
    this.isSale = this.giftCardData['isSale'];
    if (this.isSale) {
      this.giftCardOffer = this.giftCardData['offerSaleTitle'];
    } else {
      this.giftCardOffer = this.giftCardData['offerTitle'];
    }
    this.giftCardSKU = this.giftCardData['productSKU'];
    this.giftCardCurrency = this.giftCardData['currency'];
    if (!this.isRedeem) {
      if (this.isSale) {
        this.giftCardOfferValue = this.giftCardData['offerSaleValue'];
      } else {
        this.giftCardOfferValue = this.giftCardData['offerValue'];
      }
    } else {
      this.giftCardOfferValue = 0;
    }
    this.giftCardDescription = this.giftCardData['description'];
    this.giftCardTerms = this.giftCardData['termsAndCondition'];
    this.giftCardTermsLink = this.giftCardData['termsLink'];
    this.giftHowToRedeem = this.giftCardData['redeemDescription'];
    this.processingFee = this.giftCardData['processingFee'];
    let paymentModes = this.giftCardData['method'];
    if (paymentModes) {
      this.paymentModes = paymentModes[0];
    }

    //extra for this page
    this.giftCardTheme = this.giftCardData['theme'];
    if (this.giftCardTheme.length > 0) {
      this.themeImage = this.giftCardTheme[0]['emailImage']
    } else {
      this.giftCardTheme = giftThemesMockData
      this.themeImage = this.giftCardTheme[0]['emailImage']
    }

    //For amount child component
    this.giftCardAmountData = {};
    this.giftCardAmountData['giftCardDenominations'] = this.giftCardData['denominations'];
    this.giftCardAmountData['giftCardMinPrice'] = this.giftCardData['minPrice'];
    this.giftCardAmountData['giftCardMaxPrice'] = this.giftCardData['maxPrice'];
    this.giftCardAmountData['priceType'] = this.giftCardData['priceType'];
    this.giftCardAmountData['giftCardOfferValue'] = this.giftCardOfferValue;
  }

  changeTheme($event, imgSrc) {
    $event.preventDefault();
    let activeElem = this.themeGrid.nativeElement.querySelector('.active');
    if (activeElem !== null) {
      activeElem.classList.remove('active');
    }
    $event.srcElement.parentElement.classList.add("active");
    this.themeImage = imgSrc
  }

  receiveAmount(object) {
    //console.log(object)
    this.giftCardAmount = object['giftCardAmount'];
    this.giftCardDiscount = object['giftCardDiscount'];
    this.totalAmount = object['amountAfterDiscount'];
    if (this.totalAmount == 0) {
      this.secondFormGroup.controls.secondCtrl.setValue('');
    } else {
      this.secondFormGroup.controls.secondCtrl.setValue(this.totalAmount);
    }
    this.paymentData = {};
    this.paymentData['totalAmount'] = this.totalAmount;
    this.paymentData['processingFee'] = this.processingFee;
    this.paymentData['giftCardDiscount'] = this.giftCardDiscount;
    this.paymentData['paymentModes'] = this.paymentModes;
  }

  receivePayment(object) {
    //console.log(object)
    this.payableAmount = object['payableAmount'];
    this.fromWalletBalance = object['fromWalletBalance'];
    this.paymentMethod = object['paymentMethod'];
    this.processingAmount = object['processingAmount'];
    if (this.payableAmount === 0 && this.fromWalletBalance > 0) {
      Swal.fire({
        title: 'Processing, Please wait!!!',
        html:
          '<small>Your payment has been processed but transaction is not yet complete</small><br>' +
          '<img style="height: 200px" src="../../../../../assets/images/clone-dribbble.gif" ><br>' +
          '<small>Please do not hit refresh or back button or close this window</small>',
        padding: '3em',
        allowOutsideClick: false,
        showConfirmButton: false,
        backdrop: `
          rgb(255 255 255)
          left top
          no-repeat
        `
      });
      this.submitToQwikcilver();
    } else {
      this.getRazorPayOrderId()
    }
  }

  getRazorPayOrderId() {
    const model = {
      chegUserID: +utilities.getChegUID(),
      bName: utilities.getBankName(),
      productId: this.giftCardId,
      productSKU: this.giftCardSKU,
      amount: this.giftCardAmount,
      discountAmount: this.giftCardDiscount,
      rewardPayBalance: this.fromWalletBalance,
      payableAmount: this.payableAmount,
      IsSale: this.isSale,
      type: (this.isRedeem) ? 'redeem' : ''
    }
    //console.log(model)
    this.giftsService.getRazorPayOrderId(model)
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        //console.log(res)
        if ((res.status).toLowerCase() == 'success' && res.orderID !== '') {
          this.payWithRazor(res.orderID);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: res.message,
            footer: '<strong class="text-danger">Choose a valid amount and try again!</strong>'
          })
        }
        this.removeClass = true;// just to change active class of checkout button
      }, err => {
      });
  }

  payWithRazor(orderID) {
    const options: any = {
      key: this.razorPayKey,
      amount: this.payableAmount * 100, // amount should be in paise format to display Rs 1255 without decimal point
      currency: 'INR',
      name: utilities.getBankFullName(), // company name or product name
      description: 'Compare & Shop',  // product description
      image: '../../../../../assets/images/' + utilities.getBankName().toLowerCase() + '_logo.png', // company logo or product image
      order_id: orderID, // order_id created by you in backend
      modal: {
        // We should prevent closing of the form when esc key is pressed.
        escape: false,
      },
      prefill: {
        name: this.authService.userName,
        email: this.authService.emailID,
        contact: this.authService.mobNumber,
        method: this.paymentMethod
      },
      method: this.paymentModes,
      notes: {
        address: "Razorpay Corporate Office"
      },
      theme: {
        color: utilities.getThemeColor()
      },
      options: {
        checkout: {
          config: {
            display: {
              blocks: {
                banks: {
                  name: 'Pay using PNB',
                  instruments: [
                    {
                      method: 'netbanking',
                      banks: [
                        "PNB"
                      ]
                    }
                  ]
                }
              },
              sequence: [
                'block.banks'
              ],
              preferences: {
                show_default_blocks: false
              }
            }
          }
        }
      }
    };
    options.handler = ((response, error) => {
      options.response = response;
      // console.log(JSON.stringify(response));
      // console.log(options);
      // call your backend api to verify payment signature & capture transaction

      this.orderId = options.order_id;
      this.razorpayOrderId = response.razorpay_order_id;
      this.razorpayPaymentId = response.razorpay_payment_id;
      this.razorpaySignature = response.razorpay_signature

      const model = {
        chegUserID: +utilities.getChegUID(),
        bankName: utilities.getBankName(),
        bankUserId: utilities.getBankID(),
        order_id: options.order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        razorpay_amount: this.payableAmount,
        rewardPayBalance: this.fromWalletBalance
      }

      Swal.fire({
        title: 'Processing, Please wait!!!',
        html:
          '<small>Your payment has been processed but transaction is not yet complete</small><br>' +
          '<img style="height: 200px" src="../../../../../assets/images/clone-dribbble.gif" ><br>' +
          '<small>Please do not hit refresh or back button or close this window</small>',
        padding: '3em',
        allowOutsideClick: false,
        showConfirmButton: false,
        backdrop: `
          rgb(255 255 255)
          left top
          no-repeat
        `
      })

      this.giftsService.postRazorPaymentDetails(model)
        .pipe(takeUntil(this.destroy$)).subscribe(res => {
          //console.log(res)
          if ((res.status).toLowerCase() === "captured") {
            this.submitToQwikcilver();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Transaction failed...',
              text: res.message,
              footer: '<strong class="text-danger">Your transaction failed. Please try again!</strong>'
            })
          }
        }, err => {
        });
    });
    options.modal.ondismiss = (() => {
      // handle the case when user closes the form while transaction is in progress
      //console.log('Transaction cancelled.');
      let timerInterval
      Swal.fire({
        title: 'Transaction cancelled.',
        html:
          '<small>Unable to process the payment. We are redirecting to all gift cards page in <b>4</b> secs.</small><br>' +
          '<img style="height: 60px" src="../../../../../assets/images/warning.png" ><br>' +
          '<small>Please do not hit refresh or back button or close this window</small>',
        padding: '3em',
        timer: 4000,
        allowOutsideClick: false,
        showConfirmButton: false,
        backdrop: `
          rgb(255 255 255)
          left top
          no-repeat
        `,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading()
          timerInterval = setInterval(() => {
            const content = Swal.getContent()
            if (content) {
              const b = content.querySelector('b')
              if (b) {
                let sec = (Swal.getTimerLeft() % 60000) / 1000;
                b.textContent = `${Math.floor(sec) + 1}`
              }
            }
          }, 1000)
        },
        willClose: () => {
          clearInterval(timerInterval);
          this.router.navigateByUrl('gift-cards');
        }
      })
    });
    const rzp = new this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }


  submitToQwikcilver() {
    const model = {
      address: {
        billToThis: true,
        city: "",
        company: "",
        country: "IN",
        email: this.thirdFormGroup.controls.emailFormControl.value,
        firstname: this.thirdFormGroup.controls.nameFormControl.value,
        lastname: this.thirdFormGroup.controls.nameFormControl.value,
        line1: "",
        line2: "",
        postcode: "",
        region: "",
        telephone: '+91' + this.thirdFormGroup.controls.mobileFormControl.value
      },
      billing: {
        city: "",
        company: "",
        country: "",
        email: "",
        firstname: this.thirdFormGroup.controls.senderFormControl.value,
        lastname: this.thirdFormGroup.controls.senderFormControl.value,
        line1: "",
        line2: "",
        postcode: "",
        region: "",
        telephone: ""
      },
      couponCode: "",
      deliveryMode: "API",
      payments: [
        {
          amount: +this.giftCardAmount,
          code: "svc"
        }
      ],
      products: [
        {
          currency: this.giftCardCurrency,
          price: +this.giftCardAmount,
          qty: 1,
          sku: this.giftCardSKU,
          theme: ""
        }
      ],
      refno: "dfd",
      syncOnly: true,
      custom: {
        name: this.thirdFormGroup.controls.nameFormControl.value,
        mobile: this.thirdFormGroup.controls.mobileFormControl.value,
        email: this.thirdFormGroup.controls.emailFormControl.value,
        sender: this.thirdFormGroup.controls.senderFormControl.value,
        senderEmail: this.authService.emailID,
        message: this.thirdFormGroup.controls.messageFormControl.value,
        theme: this.themeImage,
        amount: this.giftCardAmount,
        giftCardImage: this.giftCardImage,
        giftCardExpiry: this.giftCardExpiry,
        chegCustomerId: utilities.getChegUID(),
        bankName: utilities.getBankName(),
        bankUserId: utilities.getBankID(),
        rewardPayBalance: this.fromWalletBalance,
        orderId: this.orderId,
        razorpayOrderId: this.razorpayOrderId,
        razorpayPaymentId: this.razorpayPaymentId,
        razorpaySignature: this.razorpaySignature,
        razorpayAmount: this.payableAmount,
        discountAmount: this.giftCardDiscount,
        discountPercentage: this.giftCardOfferValue,
        payableAmount: this.payableAmount,
        isSelf: false,
        type: "web",
        productId: this.giftCardId,
        productName: this.giftCardName,
        productSku: this.giftCardSKU,
        processingFee: this.processingAmount,
        termsAndCondition: this.giftCardTermsLink
      },
    }
    //console.log(JSON.stringify(model))
    this.giftsService.postGiftCardOrder(model)
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        //console.log(res)
        if ((res.status).toLowerCase() === "complete" || (res.status).toLowerCase() === "processing") {
          Swal.close();
          this.runConfetti = true;
          Swal.fire({
            title: 'Thank You',
            text: 'Your transaction has been successfully placed.',
            icon: 'success',
            confirmButtonText: 'Continue Shopping',
            allowOutsideClick: false
          }).then((result) => {
            if (result.isConfirmed) {
              this.runConfetti = false;
              this.userService.updatedWalletbalance();
              this.router.navigateByUrl('gift-cards');
            }
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: res.message,
            // footer: '<strong class="text-danger">Your transaction failed. Please try again!</strong>'
          })
          this.router.navigateByUrl('gift-cards');
        }
      }, err => {
      });
  }

  onVisible() {
    console.log(this.giftCardData);
    let arrayObj = new impressionData();
    arrayObj.type = 'Click';
    arrayObj.page_name ='giftcard_page';
    arrayObj.section = 'Gift Cards';
    arrayObj.idType='giftcard';
    arrayObj.name = this.giftCardName;
    arrayObj.source = (this.giftCardData.giftCardSource == null || this.giftCardData.giftCardSource =='')?'Cheggout':this.giftCardData.giftCardSource;
    arrayObj.merchantID = this.giftCardData.siteId;
    arrayObj.merchantName = this.giftCardData.siteName;
    //console.log(arrayObj)
    utilities.saveImpressionDetails(arrayObj);
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
