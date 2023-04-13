import { Component, OnInit } from '@angular/core';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject, from } from 'rxjs';
import { TitleService } from '@app/core/services/title.service';
import { AuthService } from '@core/services/auth.service';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  userName: string = '';
  walletBalance: number = 0;
  
  constructor(
    private titleService: TitleService,
    private authService: AuthService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userName = this.authService.userName;
    this.getRedeemBalance();
    this.titleService.setTitle("My earnings, orders and gift cards");    
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
