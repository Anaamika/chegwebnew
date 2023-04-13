import { Component, OnInit, OnDestroy } from '@angular/core';
import { FooterService } from '@app/core/services/footer.service';
import { OffersDataProviderService } from '@core/services/offers-data-provider.service';
import { StorageService } from '@core/services/storage.service';
import { GiftsService } from '@core/services/gifts.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { utilities } from '@utilities/utilities';
import { interval, Subscription } from 'rxjs';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})

export class FooterComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  disclaimerData = [];
  bank = utilities.getBankName();
  //footerCategoriesData = [];
  private subscription: Subscription;

  year = new Date().getFullYear();
  constructor(
    private footerService: FooterService,
    private offerService: OffersDataProviderService,
    private giftsService: GiftsService,
    private storageService: StorageService,
    ) { }

  ngOnInit(): void {
    this.getFooterData();
    this.insertImpressionDetails();

    this.subscription = interval(1800000)// Call insertImpressionDetails every 30 minutes.
      .subscribe(x => { this.insertImpressionDetails(); });
    //this.getFooterCategories();
  }

  public getFooterData() {
    this.footerService.getfooterdeatils()
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        //console.log(res)
        if (res) {
          this.disclaimerData = res;
        } else {
          this.disclaimerData = [];
        }
     //   this.getAllOffers();
     //   this.getAllGiftCards();
      }, err => {
      });
  }

  // public getFooterCategories() {
  //   this.footerService.getFooterCategoriesForSEO()
  //     .pipe(takeUntil(this.destroy$)).subscribe(res => {
  //       if (res) {
  //         this.footerCategoriesData = res;
  //         this.getAllOffers();
  //       }
  //     }, err => {
  //     });
  // }

  getAllOffers() {
    this.offerService.getAllOffers()
      .pipe(takeUntil(this.destroy$)).subscribe(() => {
      }, err => {
      });
  }

  getAllGiftCards() {
    this.giftsService.getAllGiftCards()
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
      }, err => {
      });
  }

  public insertImpressionDetails() {
    if (utilities.getImpressionDetails()) {
      if (utilities.getImpressionDetails().length > 10) {
        this.footerService.insertImpressionDetails().pipe(takeUntil(this.destroy$)).subscribe((res) => {
          if (res) {
            this.storageService.removeLocalStorage('impressionEvents');
          }
        },
          (err) => { }
        );
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
