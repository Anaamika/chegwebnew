import { Component, OnInit, Input } from '@angular/core';
import { AppConstants } from '@app/config/app-constants';
import { SearchService } from '@app/core/services/search.service';
import { AuthService } from '@core/services/auth.service';
import { DialogService } from '@core/services/dialog.service';
import { utilities } from '@app/utilities/utilities';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-offers-carousel',
  templateUrl: './offers-carousel.component.html',
  styleUrls: ['./offers-carousel.component.scss']
})
export class OffersCarouselComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();

  //@ViewChild('offerCarousel', { static: false }) offerCarousel: ElementRef;
  //carousel_outer_width: number;

  @Input() offersData;
  customOptions: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplaySpeed: 800,
    autoplayTimeout: 4000,
    autoplayHoverPause: true,
    autoplayMouseleaveTimeout: 4000,
    margin: 0,
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
      // 400: {
      //   items: 2
      // },
      // 740: {
      //   items: 2
      // },
      // 940: {
      //   items: 3
      // }
    },
    nav: false,
    // stagePadding: 50,
  }

  constructor(
    private searchService: SearchService,
    private dialogService: DialogService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  postProductInfo($event, data) {
    $event.stopPropagation();
    $event.preventDefault();
    console.log(data)

    let isEligibleForCashback = utilities.isAccountTypeA();
    if (isEligibleForCashback) {
      if (this.authService.isAuthenticated() || this.authService.isGuestUSer()) {
        this.shop(data);
      } else {
        utilities.addHTMLClass(['login_page']);
        const options = {
          title: 'Home-Banner',
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
    } else {
      this.shop(data);
    }
  }

  shop(data) {
    const model = utilities.generateProductInfoObject(data, 'Home-Banner', null);
    this.searchService.postProductInfo(model).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
      }
    }, err => {
    });
  }

  openTermsDialog($event, data) {
    console.log(data)
    $event.stopPropagation();
    $event.preventDefault();
    let options = {
      siteName: data.marchantName,
      sitelogo: '',
      siteUrl: '',
      siteDetails: '',
      rewardTitle: data.redeemTitle,
      rewardDescription: '',
      rewardTerms: data.termsAndConditions,
      offerTitle: data.bannerTitle,
      offerDescription: '',
      offerTerms: data.terms,
      cancelText: 'CLOSE',
      confirmText: 'YES, LEAVE PAGE'
    };
    this.dialogService.openTerms(options);
    this.dialogService.termsConfirmed().subscribe(confirmed => {
      if (confirmed) {
      }
    });
  }
  // ngAfterViewInit() {
  //   let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  //   let w =  window.innerWidth - scrollbarWidth;
  //   this.carousel_outer_width = w;
  //   this.cdRef.detectChanges();
  // }

}
