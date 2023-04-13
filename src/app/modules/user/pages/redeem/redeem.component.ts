import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject, from } from 'rxjs';
import { giftCardsMockData } from '@shared/mock/gift-cards-data';
import { GiftsService } from '@core/services/gifts.service';
import { utilities } from '@utilities/utilities';
import { gsap, TweenMax, Circ } from "gsap/all";
import { TitleService } from '@app/core/services/title.service';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';

gsap.registerPlugin(Circ);

@Component({
  selector: 'app-redeem',
  templateUrl: './redeem.component.html',
  styleUrls: ['./redeem.component.scss']
})
export class RedeemComponent implements OnInit, OnDestroy {

   destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('filterBlock') filterBlock: ElementRef;

  giftCardsData = giftCardsMockData;
  filteredData = [];
  categoriesList = [];
  retailersList = [];

  selectedFilters = [];
  //categoryTitle: string = 'All Gift Cards';
  //categoryTitle: string = 'Select the brands(s) of which you want to avail Gift Cards';
  bankName = utilities.getBankName();
  categoryTitle: string = this.bankName === 'BFSL' ? 'Shop for Gift Cards' : 'Shop for the Gift Card Brand(s)';
  bankFullName = utilities.getBankFullName();
  hideBanner: boolean = false;
  isBank: boolean = false;
  isRedeem: boolean = true;

  userName: string = '';
  walletBalance: number = 0;

  constructor(
    private titleService: TitleService,
    private giftsService: GiftsService,
    private authService: AuthService,
    private userService: UserService,
    private cd: ChangeDetectorRef, 
  ) { }

  ngOnInit(): void {
    this.userName = this.authService.userName;
    this.getRedeemBalance();
    this.titleService.setTitle("Redeem your cashback earnings");
    this.titleService.updateDescription("Redeem all your wallet balance with a gift card of your choice.");
    let type = utilities.getType();
    if (type === 'Bank') {
      this.isBank = true;
    } else {
      this.isBank = false;
    }

    if (this.giftsService.allGiftCards.length > 0) {
      this.giftCardsData = this.giftsService.allGiftCards;
      this.filteredData = this.giftCardsData;
    } else {
      this.getAllGiftCards();
    }
    this.getGiftCardCategories();
    this.getGiftCardRetailers();  
  }

  private getRedeemBalance() {
    this.userService.getRedeemBalance()
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res.length > 0) {
          this.walletBalance = res[0].walletBalance;
        }
      }, err => {
      });
  }

  getAllGiftCards() {
    this.giftsService.getAllGiftCards()
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res.length > 0) {
          this.giftCardsData = res;
          this.filteredData = this.giftCardsData;
        }
      }, err => {
      });
  }

  getGiftCardCategories() {
    this.giftsService.getGiftCardCategories()
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res.length > 0) {
          this.categoriesList = [];
          this.categoriesList = res;
        }
      }, err => {
      });
  }

  getGiftCardRetailers() {
    this.giftsService.getGiftCardRetailers()
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res.length > 0) {
          this.retailersList = [];
          this.retailersList = res;
        }
      }, err => {
      });
  }

  receiveFilter($event) {
    this.categoryTitle = $event['title'];
    delete $event['title'];
    this.selectedFilters = $event;

    if (utilities.checkIfObjValuesEmpty($event)) {
      this.categoryTitle = 'All';
    }
    this.filteredData = utilities.arrayObjectMultiFilter(this.giftCardsData, this.selectedFilters);
    this.cd.detectChanges();
  }

  public showFilters($event) {
    $event.preventDefault();
    let elem = this.filterBlock.nativeElement.querySelector('.mobile-filter');
    TweenMax.to(elem, .2, { top: '0', opacity: 1, ease: Circ.easeOut });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
