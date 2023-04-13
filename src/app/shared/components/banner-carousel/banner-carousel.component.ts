import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { DialogService } from '@core/services/dialog.service';
import { AuthService } from '@core/services/auth.service';
import { utilities } from '@app/utilities/utilities';
import { StorageService } from '@core/services/storage.service';
import { Subject } from 'rxjs';
import { impressionData } from '@shared/models/impression-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-banner-carousel',
  templateUrl: './banner-carousel.component.html',
  styleUrls: ['./banner-carousel.component.scss']
})
export class BannerCarouselComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() bannersData;

  customOptions: OwlOptions = {
    margin: 20,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 800,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      420: {
        items: 2
      },
      740: {
        items: 2
      },
      940: {
        items: 2
      },
      1024: {
        items: 3
      }
    },
    nav: false,
    autoplay: true,
    loop: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true
    // stagePadding: 30,
  }

  constructor(
    private dialogService: DialogService,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onVisible(data, id, type,eventType) {
    console.log( data);
    let page = this.router.url =='/'? 'home':this.router.url;
    let pageName = page.indexOf('/')>-1?page.split('/')[1]:page;
    let arrayObj = new impressionData();
    arrayObj.type = eventType;
    arrayObj.page_name = pageName+'_page';
    arrayObj.id=id;
    arrayObj.idType='banner';
    if(type == 'coupon'){
      arrayObj.name =  data.offerTitle ?? data.offer;
      arrayObj.merchantID = data.siteId;
      arrayObj.source = (data.couponSource == null || data.couponSource == '')?'Cheggout':data.couponSource;
    }else if(type == 'store'){
      arrayObj.name =  data.siteName;
    }else if(type == 'gifts'){
      arrayObj.name =  data.productName;
      arrayObj.merchantID = data.siteId;
      arrayObj.merchantName = data.siteName;
      arrayObj.source = (data.giftCardSource == null || data.giftCardSource == '')?'Cheggout':data.giftCardSource;
    }
    //console.log(arrayObj)
    utilities.saveImpressionDetails(arrayObj);
  }

  login(data) {
    utilities.addHTMLClass(['login_page']);
    const options = {
      title: 'Store',
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

  //Store
  openTermsDialog($event, data,id) {
    console.log(data)
    this.onVisible(data, id, 'store','Click');
    $event.stopPropagation();
    $event.preventDefault();
    let options = {
      siteName: data.siteName,
      sitelogo: data.logo,
      siteUrl: data.siteUrl,
      href: data.href,
      siteDetails: data.advertiserDetails,
      rewardTitle: data.offerTitle,
      rewardDescription: data.offerDescription,
      rewardTerms: data.termsAndConditions,
      offerTitle: '',
      offerDescription: '',
      offerTerms: '',
      cancelText: 'CLOSE',
      confirmText: 'YES, LEAVE PAGE'
    };
    this.dialogService.openTerms(options);
    this.dialogService.termsConfirmed().subscribe(confirmed => {
      if (confirmed) {
        this.login(data);
      }
    });
  }

  //Coupon
  getOfferInfo($event, data,id) {
    this.onVisible(data, id, 'coupon','Click');
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

  //GiftCard
  openGiftsDialog($event, data,id) {
    this.onVisible(data, id, 'gifts','Click');
    $event.stopPropagation();
    $event.preventDefault();

    if (this.authService.isAuthenticated()) {
      this.openDialog(data)
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
          this.openDialog(data)
        }
        utilities.removeHTMLClass(['login_page']);
      });
    }
  }

  openDialog(data) {
    let options = {
      giftCardId: data.productId,
      isRedeem: false,
      cancelText: 'CLOSE',
      confirmText: 'YES, LEAVE PAGE'
    };
    utilities.addHTMLClass(['gift_dialog']);
    this.dialogService.openGifts(options);
    this.dialogService.giftsConfirmed().subscribe(confirmed => {
      if (confirmed) {
      }
      utilities.removeHTMLClass(['gift_dialog']);
    });
  }
  onHyperlinkVisible(data, id, type,eventType){
    let arrayObj = new impressionData();
    arrayObj.type = eventType;
    arrayObj.page_name = 'Home';
    arrayObj.section = 'Banner Ad';
    arrayObj.adType = type;
    arrayObj.id = id;
    arrayObj.idType='home'
    arrayObj.adTitle = data.title ;
    arrayObj.hyperLink = data.hyperLink;
    arrayObj.name = data.title;
    //console.log(arrayObj)
    utilities.saveImpressionDetails(arrayObj);
  }
  openHyperlink(data,url,id){
    this.onHyperlinkVisible(data, id, 'Hyperlink','Click');
    this.router.navigateByUrl(url);
  }
  openCustomCategory(data,id){
    this.onHyperlinkVisible(data, id, 'Custom Category','Click');
    let url = '/featured/m/'+data.customCategoryId+'/'+data.customCategoryName;
    this.router.navigateByUrl(url);
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
  
}
