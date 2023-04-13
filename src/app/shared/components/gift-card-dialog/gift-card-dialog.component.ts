import { Component, OnInit, Inject, HostListener, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { utilities } from '@app/utilities/utilities';
import { GiftsService } from '@core/services/gifts.service';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { WindowRefService } from '@core/services/window-ref.service';
import Swal from 'sweetalert2';
import { gsap, TweenMax, Circ, Power2 } from "gsap/all";
import { DOCUMENT } from '@angular/common';

gsap.registerPlugin(Circ);

@Component({
  selector: 'app-gift-card-dialog',
  templateUrl: './gift-card-dialog.component.html',
  styleUrls: ['./gift-card-dialog.component.scss']
})
export class GiftCardDialogComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  bName = utilities.getBankName();
  bank = this.bName == '' ? 'cheggout' : this.bName;
  action = {};
  giftCardData: any = [];

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

  sectionHeight: number;
  @ViewChild('giftsContainer') giftsContainer: ElementRef;
  @ViewChild('giftsDialog') giftsDialog: ElementRef;
  @ViewChild('giftsDialogFront') giftsDialogFront: ElementRef;
  @ViewChild('giftsDialogBack') giftsDialogBack: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      giftCardId: number,
      cancelText: string,
      confirmText: string
    },
    private mdDialogRef: MatDialogRef<GiftCardDialogComponent>,
    private giftsService: GiftsService,
    private authService: AuthService,
    private userService: UserService,
    private winRef: WindowRefService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.action = data;
  }

  ngOnInit(): void {
    this.giftCardId = this.action['giftCardId'];
    if (this.action['isRedeem']) {
      this.isRedeem = this.action['isRedeem'];
    }

    this.giftsService.getRazorPayKey().pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
        this.razorPayKey = res.razorKey;
      }
    }, err => {
    });

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
    } else {
      this.getGiftCardDetail();
    }
  }

  ngAfterViewInit() {
    TweenMax.set(this.giftsContainer.nativeElement, {
      css: {
        width: '100%',
        height: '100vh',
        perspective: 1500,
        perspectiveOrigin: '50% 50% 0px',
        'margin-left': 'auto',
        'margin-right': 'auto',
      }
    })

    TweenMax.set(this.giftsDialog.nativeElement, {
      css: {
        transformStyle: "preserve-3d",
        z: 0
      }
    });

    TweenMax.set(this.giftsDialogBack.nativeElement, {
      css: {
        rotationY: -180,
        display: 'none'
      }
    });

    TweenMax.set([this.giftsDialogFront.nativeElement, this.giftsDialogBack.nativeElement], {
      css: {
        width: '100%',
        height: '100%',
        backfaceVisibility: "hidden",
        position: "absolute"
      }
    });
  }

  viewDetail(str: string) {
    if (str == "F") {  // Iphone scroll issuse Fix.
      TweenMax.to(this.giftsDialogBack.nativeElement, { css: { display: "none" } });
      TweenMax.to(this.giftsDialogFront.nativeElement, { css: { display: "block" } });
    } else {
      TweenMax.to(this.giftsDialogFront.nativeElement, { css: { display: "none" } });
      TweenMax.to(this.giftsDialogBack.nativeElement, { css: { display: "block" } });
    }
    TweenMax.to(this.giftsDialog.nativeElement, 1, { css: { rotationY: "+=180" }, ease: Power2.easeInOut });
    TweenMax.to(this.giftsDialog.nativeElement, 0.5, { css: { z: "-=100" }, yoyo: true, repeat: 1, ease: Power2.easeIn });
  }

  getGiftCardDetail() {
    //console.log(this.giftCardData)
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

    //For amount child component
    this.giftCardAmountData = {};
    this.giftCardAmountData['giftCardDenominations'] = this.giftCardData['denominations'];
    this.giftCardAmountData['giftCardMinPrice'] = this.giftCardData['minPrice'];
    this.giftCardAmountData['giftCardMaxPrice'] = this.giftCardData['maxPrice'];
    this.giftCardAmountData['priceType'] = this.giftCardData['priceType'];
    this.giftCardAmountData['giftCardOfferValue'] = this.giftCardOfferValue;

    setTimeout(() => {
      let section = this.document.querySelector('.mat-dialog-gift-section');
      this.sectionHeight = section.scrollHeight + 40;
    }, 500);
  }

  receiveAmount(object) {
    //console.log(object)
    this.giftCardAmount = object['giftCardAmount'];
    this.giftCardDiscount = object['giftCardDiscount'];
    this.totalAmount = object['amountAfterDiscount'];
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
    //console.log(JSON.stringify(model))
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
      });

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
          //this.router.navigateByUrl('gift-cards');
          this.close(true);
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
        email: this.authService.emailID,
        firstname: this.authService.userName,
        lastname: this.authService.userName,
        line1: "",
        line2: "",
        postcode: "",
        region: "",
        telephone: '+91' + this.authService.mobNumber
      },
      billing: {
        city: "",
        company: "",
        country: "",
        email: "",
        firstname: this.authService.userName,
        lastname: this.authService.userName,
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
        name: this.authService.userName,
        mobile: this.authService.mobNumber,
        email: this.authService.emailID,
        sender: this.authService.userName,
        senderEmail: this.authService.emailID,
        message: 'Best Wishes',
        theme: '',
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
        isSelf: true,
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
          let dialogData: any;
          if(this.bName === 'BFSL') {
            dialogData = {
              title: 'Thank You',
              text: 'Your transaction has been successfully completed.',
              icon: 'success',
              showDenyButton: true,
              confirmButtonText: 'Continue Shopping',
              denyButtonText: 'Redeem My Gift Cards',
              denyButtonColor: '#ff6633',
              allowOutsideClick: false
            }
          } else {
            dialogData = {
                title: 'Thank You',
                text: 'Your transaction has been successfully completed.',
                icon: 'success',
                confirmButtonText: 'Continue Shopping',
                allowOutsideClick: false
            }
          }
          Swal.close();
          this.runConfetti = true;
          Swal.fire(dialogData).then((result) => {
            if (result.isConfirmed) {
              this.runConfetti = false;
              this.userService.updatedWalletbalance();
              this.close(true);
            }  else if (result.isDenied) {
              this.runConfetti = false;
              this.close(true);
              this.router.navigateByUrl('account/mygiftcards');
            }
          })
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: res.message,
            // footer: '<strong class="text-danger">Your transaction failed. Please try again!</strong>'
          })
          //this.router.navigateByUrl('gift-cards');
          this.close(true);
        }
      }, err => {
      });
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
  @HostListener("keydown.esc")
  public onEsc() {
    this.close(false);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
