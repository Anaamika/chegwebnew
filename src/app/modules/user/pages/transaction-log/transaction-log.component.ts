import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { StorageService } from '@core/services/storage.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as XLSX from 'xlsx';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationStart } from "@angular/router";
@Component({
  selector: 'app-transaction-log',
  templateUrl: './transaction-log.component.html',
  styleUrls: ['./transaction-log.component.scss']
})
export class TransactionLogComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  corpLedger: Array<object> = [];
  currentDate = new Date();
  rewardsAwarded: number = 0;
  corpRewardBalance: number = 0;
  totalFunds: number = 0;
  awardDisplayColumns: string[] = ['info', 'corpName', 'orderDate', 'rewardPoints'];

  constructor(
    @Inject(DOCUMENT) document,
    private userService: UserService,
    private storageService: StorageService,
    private router: Router
  ) {
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        const el = document.querySelector('.breadcrumb');
        el.querySelectorAll(".hr").forEach(el => el.remove());
      }
    });
  }

  ngOnInit(): void {
    this.getCorpRewardDetails();
    this.getCorpLedger();

    setTimeout(() => {
      const el = document.querySelector('.breadcrumb');
      let newItem = document.createElement("li");
      newItem.setAttribute('class', 'hr');
      let a = document.createElement("a");
      a.textContent = "HR Dashboard";
      a.setAttribute('href', "/account/hr-dashboard");
      a.setAttribute('class', 'router-link-active');
      newItem.appendChild(a);
      let lastChild = el.lastElementChild;
      el.insertBefore(newItem, lastChild);
    }, 100);
  }

  getCorpRewardDetails() {
    this.userService.getCorpRewardDetails().pipe(takeUntil(this.destroy$)).subscribe(res => {
      //console.log(res)
      if (res.length > 0) {
        this.corpRewardBalance = res[0].corpRewardBalance;
        this.totalFunds = res[0].corpRewardPoints;
        this.rewardsAwarded = res[0].corpRewardAwarded;
      }
    }, err => {
    });
  }

  getCorpLedger() {
    this.userService.getCorpLedger().pipe(takeUntil(this.destroy$)).subscribe(res => {
      //console.log('corp Ledger')
      //console.log(res)
      if (res.length > 0) {
        this.corpLedger = res;
        // let amount = 0;
        // for (let i = 0; i < res.length; i++) {
        //   amount = amount + res[i]['rewardPoints'];
        // }
        // this.totalFunds = amount;
      }
    }, err => {
    });
  }


  exportexcel(): void {
    setTimeout(() => {
      let fileName = 'Rewards_Awarded' + new Date().valueOf() + '.xlsx';

      /* table id is passed over here */
      let element = document.getElementById('excel-table');
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, fileName);
    }, 1000);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
