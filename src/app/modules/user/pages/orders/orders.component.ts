import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();

  giftCardsData: Array<object> = [];
  noData: boolean = false;

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.getMyOrders();
  }

  private getMyOrders() {
    this.userService.getMyOrders().pipe(takeUntil(this.destroy$)).subscribe(res => {
      console.log(res)
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
