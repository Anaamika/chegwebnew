import { Component, OnInit, Inject, HostListener, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { utilities } from '@app/utilities/utilities';
import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';
import { SearchService } from '@app/core/services/search.service';
import { AuthService } from '@core/services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OffersDataProviderService } from '@app/core/services/offers-data-provider.service';
import {  impressionData } from '@app/shared/models/impression-data';
import { BreakpointObserver } from '@angular/cdk/layout';
@Component({
  selector: 'app-offer-info-dialog',
  templateUrl: './offer-info-dialog.component.html',
  styleUrls: ['./offer-info-dialog.component.scss']
})
export class OfferInfoDialogComponent implements OnInit, OnDestroy {

  toggle = true;
  isLike: boolean = false;
  isDisLike: boolean = false;
  bName = utilities.getBankName();
  bank = this.bName == '' ? 'cheggout' : this.bName;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    title: string,
    couponType: string,
    couponCode: string,
    merchantName: string,
    merchantUrl: string,
    merchantLogo: string,
    offerDetail: string,
    offerAdditionalLink: string,
    offerAdditionalInfo: string,
    offerTerms: string,
    offerTermsLink: string,
    rewardTitle: string,
    rewardDescription: string,
    rewardTerms: string,
    discountAmount: string,
    discountType: string,
    promoLink: string,
    id: number,
    siteId: number,
    category: string,
    likeCount: string
    cancelText: string,
    confirmText: string,
  }, private searchService: SearchService,
    private offerService: OffersDataProviderService,
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver,
    private mdDialogRef: MatDialogRef<OfferInfoDialogComponent>) {
    //console.log(data.likeCount)
    if (data.likeCount == "1") {
      this.isLike = true;
    } else if (data.likeCount == "0") {
      this.isDisLike = true;
    }
  }

  ngOnInit(): void {

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

  postProductInfo($event, data) {
    this.onVisible(data, data.id, 'visit_store','Click');
    $event.stopPropagation();
    $event.preventDefault();
    let isEligibleForCashback = utilities.isAccountTypeA();
    if (isEligibleForCashback) {
      if (this.authService.isAuthenticated() || this.authService.isGuestUSer()) {
        this.shop(data);
      } else {
        this.confirm();
      }
    } else {
      this.shop(data);
    }
  }

  shop(data) {
    const isMobile = this.breakpointObserver.isMatched('(max-width:  767px)');
    const model = utilities.generateProductInfoObject(data, 'Offer', null, isMobile);
    this.searchService.postProductInfo(model).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
      }
    }, err => {
    });
  }

  likeClick(data) {
    let type;
    if (this.isLike) {
      this.isLike = false;
      type = null;
    } else {
      this.isLike = true;
      this.isDisLike = false;
      type = 1;
    }
    const model = {
      ChegUserDetailsId: utilities.getChegUID(),
      CouponId: data.id,
      Type: 1
    };
    this.offerService.postFavouriteOffer(model)
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        //console.log('like', res);
        // if (res) {
        //   console.log('like',res);
        // }
      }, err => {
      });
  }



  dislikeClick(data) {
    let type;
    if (this.isDisLike) {
      this.isDisLike = false;
      type = null;
    } else {
      this.isDisLike = true;
      this.isLike = false;
      type = 0;
    }
    const model = {
      ChegUserDetailsId: utilities.getChegUID(),
      CouponId: data.id,
      Type: 0
    };
    this.offerService.postFavouriteOffer(model)
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        //console.log('dislike', res);
      }, err => {
      });
  }
  onVisible(data, id, type,eventType) {
    //console.log(type, data);
    let arrayObj = new impressionData();
    arrayObj.type = eventType;
    arrayObj.page_name = 'offer_detail_page';
    arrayObj.section = 'Offer';
    arrayObj.id = id;
    arrayObj.idType = type;
    arrayObj.offerName = data.offer;
    arrayObj.merchantID = data.siteId;
    arrayObj.merchantName = data.merchantName;
    arrayObj.name = data.offer;
    //console.log(arrayObj)
    utilities.saveImpressionDetails(arrayObj);
  }
  clickCopy(data){
    this.toggle = false;
    this.onVisible(data, data.id, 'copy_coupon','Click');
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
  
  options: AnimationOptions = {
    path: '../../../../../assets/json/offer-loading.json'
  };

  styles: Partial<CSSStyleDeclaration> = {
    maxWidth: '300px',
    margin: '0',
  };

  animationCreated(animationItem: AnimationItem): void {

  }
  onLoopComplete(): void {
  }
}
