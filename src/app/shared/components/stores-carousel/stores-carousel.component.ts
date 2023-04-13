import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthService } from '@core/services/auth.service';
import { DialogService } from '@core/services/dialog.service';
import { SearchService } from '@app/core/services/search.service';
import { utilities } from '@app/utilities/utilities';
import { AppConstants } from '@app/config/app-constants';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { impressionData } from '@shared/models/impression-data';
import { Router } from '@angular/router';
@Component({
  selector: 'app-stores-carousel',
  templateUrl: './stores-carousel.component.html',
  styleUrls: ['./stores-carousel.component.scss']
})
export class StoresCarouselComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() storesData;

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
        items: 2
      },
      400: {
        items: 2
      },
      420: {
        items: 3
      },
      740: {
        items: 4
      },
      940: {
        items: 5
      },
      1024: {
        items: 6
      }
    },
    nav: false,
    // stagePadding: 30,
  }

  constructor(
    private dialogService: DialogService,
    private searchService: SearchService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  postProductInfo($event, data) {
    this.onVisible(data,data.siteID, 'store','Click')
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

  shop(data) {
    const model = utilities.generateProductInfoObject(data, 'Store', null);
    this.searchService.postProductInfo(model).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
      }
    }, err => {
    });
  }

  openTermsDialog($event, data) {
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

  onImgError($event) {
    let ext = utilities.getUrlExtension($event.srcElement.currentSrc)
    if (ext === 'webp') {
      $event.onerror = null;
      $event.srcElement.parentNode.children[0].srcset = $event.srcElement.parentNode.children[1].srcset = $event.srcElement.attributes.src.value;
    } else {
      $event.srcElement.parentNode.children[0].srcset = $event.srcElement.parentNode.children[1].srcset = '/assets/images/no-image.png';
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
  onVisible(data, id, type,eventType) {
    let page = this.router.url =='/'? 'home':this.router.url;
    let pageName = page.indexOf('/')>-1?page.split('/')[1]:page;
    let arrayObj = new impressionData();
    arrayObj.type = eventType;
    arrayObj.page_name = pageName+'_page';
    arrayObj.section = 'Stores';
    arrayObj.id = id;
    arrayObj.idType = 'store';
    arrayObj.merchantName = data.siteName;
    arrayObj.name = data.siteName;
    //console.log(arrayObj)
    utilities.saveImpressionDetails(arrayObj);
  }
}
