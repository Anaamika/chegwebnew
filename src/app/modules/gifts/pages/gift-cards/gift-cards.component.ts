import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject, from } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { giftCardsMockData } from '@shared/mock/gift-cards-data';
import { GiftsService } from '@core/services/gifts.service';
import { CategoriesDataProviderService } from '@core/services/categories-data-provider.service';
import { utilities } from '@utilities/utilities';
import { gsap, TweenMax, Circ } from "gsap/all";
import { TitleService } from '@app/core/services/title.service';

gsap.registerPlugin(Circ);
@Component({
  selector: 'app-gift-cards',
  templateUrl: './gift-cards.component.html',
  styleUrls: ['./gift-cards.component.scss']
})
export class GiftCardsComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('filterBlock') filterBlock: ElementRef;

  giftCardsData = giftCardsMockData;
  filteredData = [];
  categoriesList = [];
  retailersList = [];

  selectedFilters = [];
  categoryTitle: string = 'All';
  bankFullName = utilities.getBankFullName();
  hideBanner: boolean = false;
  isBank: boolean = false;
  isRedeem: boolean = false;
  bank = utilities.getBankName();
  isBandhan:boolean = this.bank =='BANDHAN'?true:false;
  constructor(
    private titleService:TitleService,
    private giftsService: GiftsService,
    private categoryService: CategoriesDataProviderService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      if (this.route.snapshot.paramMap.keys.length > 0) {
        this.hideBanner = true;
        if (this.router.url.indexOf('/categories/') > -1) {
          let id = +this.route.snapshot.paramMap.get('uid');
          this.categoryService.catUID = id;
          this.categoryService.catNode = this.route.snapshot.paramMap.get('cid');
          this.categoryService.catTitle = this.route.snapshot.paramMap.get('cname');
          this.getGiftCardsByID(id, "C")
        } else {
          let id = +this.route.snapshot.paramMap.get('sid');
          this.getGiftCardsByID(id, "S")
        }

      } else {
        this.hideBanner = false;
        if (this.giftsService.allGiftCards.length > 0) {
          this.giftCardsData = this.giftsService.allGiftCards;
          this.filteredData = this.giftCardsData;
          //console.log(this.filteredData)
        } else {
          this.getAllGiftCards();
        }
        this.getGiftCardCategories();
        this.getGiftCardRetailers();
      }
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle("Gift cards and gift vouchers online. Get up to 15% discount on gift cards");
    this.titleService.updateDescription("Experience shopping with Gift Cards. Get discounts up to 15% on your gift card order from "+this.bankFullName);
    let type = utilities.getType();
    if (type === 'Bank') {
      this.isBank = true;
    } else {
      this.isBank = false;
    }
  }

  getAllGiftCards() {
    this.giftsService.getAllGiftCards()
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        //console.log(res)
        if (res.length > 0) {
          this.giftCardsData = res;
          this.filteredData = this.giftCardsData;
        }
      }, err => {
      });
  }

  private getGiftCardsByID(id, type) {
    this.giftsService.getGiftCardsByID(id, type)
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res.length > 0) {
          this.giftCardsData = res;
          this.filteredData = this.giftCardsData;
        }
        else {
          this.giftCardsData = [];
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
