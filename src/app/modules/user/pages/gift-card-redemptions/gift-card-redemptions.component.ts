import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Sort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { FormControl } from '@angular/forms';
import { Router, NavigationStart } from "@angular/router";
@Component({
  selector: 'app-gift-card-redemptions',
  templateUrl: './gift-card-redemptions.component.html',
  styleUrls: ['./gift-card-redemptions.component.scss']
})
export class GiftCardRedemptionsComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  displayedColumns: string[] = ['createdDate', 'senderName', 'senderEmail', 'productName', 'amount'];
  p: number = 1;
  itemsPerPage: number = 10;
  corpGiftCardsDetails: Array<object> = [];
  filteredData: Array<object> = [];
  dataBeforeSort: Array<object> = [];

  startDateFormControl = new FormControl();
  endDateFormControl = new FormControl();
  enableNoRecords: boolean = false;

  constructor(
    private userService: UserService,
    private _snackBar: MatSnackBar,
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
    this.getCorpGiftCardDetails();

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

  getCorpGiftCardDetails() {
    this.userService.getCorpGiftCardDetails().pipe(takeUntil(this.destroy$)).subscribe(res => {
      //console.log('corp Gift Card Details')
      //console.log(res)
      if (res.length > 0) {
        this.corpGiftCardsDetails = res;
        this.filteredData = this.corpGiftCardsDetails;
        this.dataBeforeSort = JSON.parse(JSON.stringify(this.filteredData));
        this.enableNoRecords = true;
      }
    }, err => {
    });
  }

  eventStartDate(type: string, event: MatDatepickerInputEvent<Date>) {
    //console.log(new Date(event.value).getTime())
    let sDate = this.startDateFormControl.value.getTime();
    let eDate;
    if (this.endDateFormControl.value) {
      let day = 60 * 60 * 24 * 1000;
      eDate = this.endDateFormControl.value.getTime() + day;
    }
    if (sDate && eDate) {
      if (sDate < eDate) {
        this.filterByDate(sDate, eDate);
      } else {
        this.clearStartDate();
        this._snackBar.open('Start date should be a date before end date', '', {
          duration: 2000,
          panelClass: ['red-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.resetData();
      }
    }
  }

  eventEndDate(type: string, event: MatDatepickerInputEvent<Date>) {
    //console.log(new Date(event.value).getTime())
    let sDate;
    if (this.startDateFormControl.value) {
      sDate = this.startDateFormControl.value.getTime();
    }
    let day = 60 * 60 * 24 * 1000;
    let eDate = this.endDateFormControl.value.getTime() + day;
    if (sDate && eDate) {
      if (sDate < eDate) {
        this.filterByDate(sDate, eDate);
      } else {
        this.clearEndDate();
        this._snackBar.open('End date should be a date after start date', '', {
          duration: 2000,
          panelClass: ['red-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.resetData();
      }
    }
  }

  filterByDate(sDate, eDate) {
    this.filteredData = this.corpGiftCardsDetails.filter(d => {
      var time = new Date(d['createdDate']).getTime();
      return (sDate <= time && time <= eDate);
    });
    this.dataBeforeSort = JSON.parse(JSON.stringify(this.filteredData));
  }

  sortData(sort: Sort) {
    const data = this.dataBeforeSort.slice();
    if (!sort.active || sort.direction === '') {
      this.filteredData = data;
      return;
    }

    this.filteredData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        // case 'orderId': return compare(a['orderId'], b['orderId'], isAsc);
        // case 'refNo': return compare(a['refNo'], b['refNo'], isAsc);
        case 'senderName': return compare(a['senderName'], b['senderName'], isAsc);
        case 'senderEmail': return compare(a['senderEmail'], b['senderEmail'], isAsc);
        case 'amount': return compare(a['amount'], b['amount'], isAsc);
        case 'productName': return compare(a['productName'], b['productName'], isAsc);
        case 'createdDate': return compare(a['createdDate'], b['createdDate'], isAsc);
        // case 'status': return compare(a['status'], b['status'], isAsc);
        default: return 0;
      }
    });
  }

  clearStartDate() {
    this.startDateFormControl.reset();
    this.resetData();
  }

  clearEndDate() {
    this.endDateFormControl.reset();
    this.resetData();
  }

  resetData() {
    this.filteredData = this.corpGiftCardsDetails;
    this.dataBeforeSort = JSON.parse(JSON.stringify(this.filteredData));
  }

  exportexcel(): void {
    this.itemsPerPage = this.filteredData.length;

    setTimeout(() => {
      /*name of the excel-file which will be downloaded. */
      let fileName = 'Gift_Card_Redemptions_' + new Date().valueOf() + '.xlsx';

      /* table id is passed over here */
      let element = document.getElementById('excel-table');
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, fileName);
      this.itemsPerPage = 10;
    }, 1000);

  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
