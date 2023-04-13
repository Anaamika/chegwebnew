import { Component, OnInit, Inject, HostListener, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '@core/services/user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { utilities } from '@app/utilities/utilities';
import { gsap, TweenMax, Circ } from "gsap/all";

gsap.registerPlugin(Circ);

import { GiftsService } from '@core/services/gifts.service';
import { Router } from '@angular/router';
import { Power2 } from 'gsap/all';
import { DialogService } from '@app/core/services/dialog.service';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-gift-info-dialog',
  templateUrl: './gift-info-dialog.component.html',
  styleUrls: ['./gift-info-dialog.component.scss']
})
export class GiftInfoDialogComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  bankName= utilities.getBankName();
  action = {};
  bName = utilities.getBankName();
  bank = this.bName == '' ? 'cheggout' : this.bName;

  giftCardData: any = [];
  giftCardInfo: any = [];
  giftCardAmount: number = 0;
  giftCardId: number;
  giftCardExpiry: string;
  giftCardNumber: number;
  giftCardPin: number;
  giftCardCreatedDate: string;
  giftCardProductName: string;
  giftCardRefNo: string;
  giftCardImage: string = '';
  giftCardSiteName: string;
  giftCardStatus: string;
  giftCardTermsAndCondtions: string;
  giftCardEmailId: string;
  siteUrl: string;
  isBFSLbtn: boolean = false;
  showPin=false;

  giftCardDescription: string = '';
  giftCardTerms: string = '';
  giftCardTermsLink: string = '';
  giftHowToRedeem: string = '';

  mobileView: boolean;

  @ViewChild('giftsContainer') giftsContainer: ElementRef;
  @ViewChild('giftsDialog') giftsDialog: ElementRef;
  @ViewChild('giftsDialogFront') giftsDialogFront: ElementRef;
  @ViewChild('giftsDialogBack') giftsDialogBack: ElementRef;

  constructor(
    private router: Router,
    private dialogService: DialogService,
    private giftsService: GiftsService,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: {
      giftCardId: number,
      cancelText: string,
      confirmText: string,
    },
    private mdDialogRef: MatDialogRef<GiftInfoDialogComponent>,
    private userService: UserService,
  ) {
    this.action = data;
  }

  ngOnInit(): void {
    let id = this.action['giftCardId'];
    this.userService.getOrderDetailsByID(id).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.length > 0) {
        this.giftCardData = res[0];
        this.getGiftCardDetail();
      }
    }, err => {
    });

    if (this.bankName === 'BFSL') {
      this.isBFSLbtn = true;
    } else {
      this.isBFSLbtn = false;
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

  ngAfterViewChecked(): void {
    this.handleViewPort();
    this.cdr.detectChanges();
  }

  handleViewPort(): void {
    if (this.breakpointObserver.isMatched('(max-width:  767px)')) {
      this.mobileView = true;
    } else {
      this.mobileView = false;
    }
  }

  getGiftCardDetail() {
    this.giftCardImage = this.giftCardData['s_Images'];
    this.giftCardAmount = this.giftCardData['amount'];
    this.giftCardNumber = this.giftCardData['cardNumber'];
    this.giftCardPin = this.giftCardData['cardPin'];
    this.giftCardCreatedDate = this.giftCardData['createdDate'];
    this.giftCardId = this.giftCardData['id'];
    this.giftCardProductName = this.giftCardData['productName'];
    this.giftCardRefNo = this.giftCardData['refNo'];
    this.giftCardSiteName = this.giftCardData['siteName'];
    this.giftCardStatus = this.giftCardData['status'];
    this.giftCardExpiry = this.giftCardData['expiry'];
    this.giftCardTermsAndCondtions = this.giftCardData['termsAndCondtions'];
    this.giftHowToRedeem = this.giftCardData['redeemDescription'];
    this.giftCardDescription = this.giftCardData['description'];
    this.giftCardEmailId = this.giftCardData['emailId'];
    this.siteUrl = this.bankName.toLowerCase() === 'bfsl' ? this.giftCardData['redeemptionUrl'] : this.giftCardData['siteUrl'];

  }
  showPassword(){
    this.showPin= !this.showPin;
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

  SendMail() {
    const model = {
      emailId: this.giftCardEmailId,
      IsSelf: true,
      cardNumber: this.giftCardNumber,
      amount: this.giftCardAmount,
      bankName: this.bName,
      expiry: this.giftCardExpiry,
      siteName: this.giftCardSiteName,
      termsAndCondtions: this.giftCardTermsAndCondtions,
      description: this.giftCardDescription,
      redeemDescription: this.giftHowToRedeem,
      cardPin: this.giftCardPin,
      siteUrl: this.siteUrl
    }
    this.giftsService.receiveMail(model).pipe().subscribe(res => {}, err => {});
      setTimeout(() => {
        this.postProductInfo();
      }, 1500);
  }

  postProductInfo() {
    this.close(true);
    utilities.addHTMLClass(['login_page']);
    const options = {
      title: 'Success',
      content: 'Your Gift Card has been sent to your email id registered with us',
      cancelText: 'Close'
    };

    this.dialogService.openGiftCardSuccess(options);
    this.dialogService.emailGiftCardSuccess().subscribe(res => {
      utilities.removeHTMLClass(['login_page']);
    });
  }

  /**
   * Navigating to redeem page for further processs
   */
  public redeemNow(): void {
    if(this.siteUrl) {
      window.open(this.siteUrl, '_blank');
    }
  };

  /***
   * To display gift details
   */
  public viewDetails(flag: string): void {
    if (flag == "F") {  // Iphone scroll issuse Fix.
      TweenMax.to(this.giftsDialogBack.nativeElement, { css: { display: "none" } });
      TweenMax.to(this.giftsDialogFront.nativeElement, { css: { display: "block" } });
    } else {
      TweenMax.to(this.giftsDialogFront.nativeElement, { css: { display: "none" } });
      TweenMax.to(this.giftsDialogBack.nativeElement, { css: { display: "block" } });
    }
    TweenMax.to(this.giftsDialog.nativeElement, 1, { css: { rotationY: "+=180" }, ease: Power2.easeInOut });
    TweenMax.to(this.giftsDialog.nativeElement, 0.5, { css: { z: "-=100" }, yoyo: true, repeat: 1, ease: Power2.easeIn });
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
