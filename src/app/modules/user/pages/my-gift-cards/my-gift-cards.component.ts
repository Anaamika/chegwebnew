import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { utilities } from '@utilities/utilities';
import { UserService } from '@core/services/user.service';
import { DialogService } from '@core/services/dialog.service';
import { TitleService } from '@app/core/services/title.service';

@Component({
  selector: 'app-my-gift-cards',
  templateUrl: './my-gift-cards.component.html',
  styleUrls: ['./my-gift-cards.component.scss']

})
export class MyGiftCardsComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  bank=utilities.getBankName();
  giftCardsData: Array<object> = [];
  noData: boolean = false;

  constructor(
    private titleService: TitleService,
    private userService: UserService,
    private dialogService: DialogService,    

  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("My Gift Cards and eVoucher orders");
    this.titleService.updateDescription("Gift cards shopping history on "+this.bank);
    this.getMyOrders();
  }

  private getMyOrders() {
    this.userService.getMyOrders().pipe(takeUntil(this.destroy$)).subscribe(res => {
      //console.log(res)
      if (res.length > 0) {
        this.giftCardsData = res;
      } else {
        this.noData = true;
      }
    }, err => {
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
