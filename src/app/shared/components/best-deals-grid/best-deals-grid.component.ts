import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { DialogService } from '@core/services/dialog.service';
import { AuthService } from '@core/services/auth.service';
import { utilities } from '@app/utilities/utilities';
import { SearchService } from '@app/core/services/search.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { impressionData } from '@app/shared/models/impression-data';
import { Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
@Component({
  selector: 'app-best-deals-grid',
  templateUrl: './best-deals-grid.component.html',
  styleUrls: ['./best-deals-grid.component.scss']
})
export class BestDealsGridComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  @Input() bestdealsData;
  p: number = 1;
  bank = utilities.getBankName();

  constructor(
    private cd: ChangeDetectorRef,
    private dialogService: DialogService,
    private authService: AuthService,
    private searchService: SearchService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    this.cd.detectChanges();
    this.p = 1;
  }

  getOfferInfo($event, data) {
    this.onVisible(data, data.id, 'offers','Click')
    $event.stopPropagation();
    $event.preventDefault();
    //console.log(this.bestdealsData)
    let options = {
      title: data.offer,
      couponType: data.couponType,
      couponCode: data.couponCode,
      merchantName: data.merchantName,
      merchantUrl: data.merchantUrl,
      merchantLogo: data.merchantLogo,
      offerDetail: data.offerDetail,
      offerAdditionalLink: data.offerAdditionalLink,
      offerAdditionalInfo: data.offerAdditionalInfo,
      offerTerms: data.terms,
      offerTermsLink: data.termsLink,
      rewardTitle: data.redeemTitle,
      rewardDescription: data.redeemTitle,
      rewardTerms: data.termsAndConditions,
      discountAmount: data.discountAmount,
      discountType: data.discountType,
      promoLink: data.promoLink,
      id: data.id,
      siteId: data.siteId,
      category: data.category,
      likeCount: data.likeCount,
      cancelText: 'CLOSE',
      confirmText: 'YES, LEAVE PAGE'
    };

    this.dialogService.openOfferInfo(options);
    this.dialogService.offerInfoConfirmed().subscribe(confirmed => {
      if (confirmed) {
        this.login(data);
      }
    });
  }

  postProductInfo($event, data) {
    $event.stopPropagation();
    $event.preventDefault();

    let isEligibleForCashback = utilities.isAccountTypeA();
    if (isEligibleForCashback) {

      if (this.authService.isAuthenticated() || this.authService.isGuestUSer()) {
        this.shop(data);
      } else {
        this.login(data);
      }
    } else {
      this.shop(data);
    }
  }

  login(data) {
    utilities.addHTMLClass(['login_page']);
    const options = {
      title: 'Best-Deal',
      message: 'Verify',
      data: data,
      cancelText: 'Cancel',
      confirmText: 'Confirm'
    };

    this.dialogService.openLogin(options);
    this.dialogService.loginConfirmed().subscribe(confirmed => {
      if (confirmed) {
        //this.shop(data);
      }
      utilities.removeHTMLClass(['login_page']);
    });
  }

  shop(data) {
    const isMobile = this.breakpointObserver.isMatched('(max-width:  767px)');
    const model = utilities.generateProductInfoObject(data, 'Best-Deal', null, isMobile);
    this.searchService.postProductInfo(model).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
      }
    }, err => {
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
  onVisible(data, id, type,eventType) {
    //console.log(type, data);
    let page = this.router.url =='/'? 'home':this.router.url;
    let pageName = page.indexOf('/')>-1?page.split('/')[1]:page;
    let arrayObj = new impressionData();
    arrayObj.type = eventType;
    arrayObj.page_name = pageName+'_page';
    arrayObj.section = 'Best Deals Ad';
    arrayObj.id = id;
    arrayObj.offerName = data.offer;
    arrayObj.merchantID = data.siteId;
    arrayObj.merchantName = data.merchantName;
    arrayObj.idType = 'offers';
    arrayObj.source = (data.couponSource == null || data.couponSource == '')?'Cheggout':data.couponSource;
    arrayObj.name = data.offer;
    //console.log(arrayObj)
    utilities.saveImpressionDetails(arrayObj);
  }

}



