import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject, from } from 'rxjs';

import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';
import { utilities } from '@app/utilities/utilities';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  walletBalance: number = 0;
  userName: string = '';
  bankName = utilities.getBankName();
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userName = this.authService.userName;
    this.getRedeemBalance();
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

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
