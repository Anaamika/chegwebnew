import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject, from } from 'rxjs';
import { utilities } from '@utilities/utilities';
import { UserService } from '@core/services/user.service';
import { DialogService } from '@core/services/dialog.service';
import { TitleService } from '@app/core/services/title.service';

@Component({
  selector: 'app-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.scss']
})
export class RewardsComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('tabST') tabST: ElementRef;
  @ViewChild('tabPH') tabPH: ElementRef;
  walletBalance: number = 0;
  shoppingTrips = [];
  paymentHistory = [];
  bank = utilities.getBankName();
  tabData = this.bank === 'BFSL' ? 'PaymentHistory' : 'Shopping Trips';

  constructor(
    private titleService: TitleService,
    private userService: UserService,
    private dialogService: DialogService,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("My shopping history");
    this.titleService.updateDescription("Earn cashback and reward points for shopping online from "+this.bank);
    this.getRedeemBalance();
    if(this.bank === 'BFSL') {
      this.getPaymentDetails();
    } else {
      this.getShoppingTrips();
    }
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

  getShoppingTrips() {
    this.userService.getShoppingTrips()
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res.length > 0) {
          this.shoppingTrips = res
        }
        this.tabST.nativeElement.classList.add('active');
        this.tabPH.nativeElement.classList.remove('active');
      }, err => {
      });
    this.tabData = 'ShoppingTrips';

  }

  getPaymentDetails() {
    this.userService.getPaymentDetails()
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res.length > 0) {
          this.paymentHistory = res;
        }
      }, err => {
      });
    this.tabData = 'PaymentHistory';
    this.tabST.nativeElement.classList.remove('active');
    this.tabPH.nativeElement.classList.add('active');
  }

  redeemCredits(event) {
    const options = {
      eWalletBalance: this.walletBalance,
    };

    this.dialogService.openRedeemCredits(options);
    this.dialogService.redeemCreditsConfirmed().subscribe(confirmed => {
      if (confirmed) {
        this.getPaymentDetails();
        this.getRedeemBalance();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
