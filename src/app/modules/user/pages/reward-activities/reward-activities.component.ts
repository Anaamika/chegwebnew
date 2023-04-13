import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, from } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { utilities } from '@utilities/utilities';
import { Sort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, NavigationStart } from "@angular/router";
@Component({
  selector: 'app-reward-activities',
  templateUrl: './reward-activities.component.html',
  styleUrls: ['./reward-activities.component.scss']
})
export class RewardActivitiesComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  corpUserLedger: Array<object> = [];
  filteredData: Array<object> = [];
  dataBeforeSort: Array<object> = [];
  p: number = 1;
  itemsPerPage: number = 10;
  firstName: string = '';
  awardsList: string[] = [];
  displayedColumns: string[] = ['firstName', 'userName', 'ledgerDate', 'debit', 'comments', 'paymentStatus'];

  startDateFormControl = new FormControl();
  endDateFormControl = new FormControl();
  isDateFilterActive: boolean = false;
  dateFilterData: Array<object> = [];
  enableNoRecords: boolean = false;

  awardsFormControl = new FormControl();

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
    this.getCorpUserLedger();

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

  getCorpUserLedger() {
    this.userService.getCorpUserLedger().pipe(takeUntil(this.destroy$)).subscribe(res => {
      //console.log(res)
      if (res.length > 0) {
        this.corpUserLedger = res;
        this.filteredData = this.corpUserLedger;
        this.dataBeforeSort = JSON.parse(JSON.stringify(this.filteredData));

        for (let i = 0; i < this.corpUserLedger.length; i++) {
          let item = this.corpUserLedger[i]['comments'];
          this.awardsList.push(item);
        }
        this.awardsList = utilities.getUniqueArray(this.awardsList);
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
    this.awardsFormControl.reset();
    if (sDate && eDate) {
      if (sDate < eDate) {
        this.filterByDate(sDate, eDate);
        this.isDateFilterActive = true;
      } else {
        this.clearStartDate();
        this._snackBar.open('Start date should be a date before end date', '', {
          duration: 2000,
          panelClass: ['red-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.resetData();
        this.isDateFilterActive = false;
      }
    }
  }

  eventEndDate(type: string, event: MatDatepickerInputEvent<Date>) {
    //console.log(new Date(event.value).getTime())
    let sDate;
    if (this.startDateFormControl.value) {
      sDate = this.startDateFormControl.value.getTime();
    }
    this.awardsFormControl.reset();
    let day = 60 * 60 * 24 * 1000;
    let eDate = this.endDateFormControl.value.getTime() + day;
    if (sDate && eDate) {
      if (sDate < eDate) {
        this.filterByDate(sDate, eDate);
        this.isDateFilterActive = true;
      } else {
        this.clearEndDate();
        this._snackBar.open('End date should be a date after start date', '', {
          duration: 2000,
          panelClass: ['red-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.resetData();
        this.isDateFilterActive = false;
      }
    }
  }

  filterByDate(sDate, eDate) {
    this.filteredData = this.corpUserLedger.filter(d => {
      var time = new Date(d['createdDate']).getTime();
      return (sDate <= time && time <= eDate);
    });
    this.dataBeforeSort = JSON.parse(JSON.stringify(this.filteredData));
    this.dateFilterData = JSON.parse(JSON.stringify(this.filteredData));
  }

  filterAward(val) {
    let filter = {};
    if (val == 'All') {
      filter = {};
    } else {
      filter['comments'] = val;
    }
    let data;
    if (this.isDateFilterActive) {
      data = this.dateFilterData;
    } else {
      data = this.corpUserLedger;
    }
    this.filteredData = utilities.arrayObjectMultiFilter(data, filter);
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
        case 'firstName': return compare(a['firstName'], b['firstName'], isAsc);
        case 'userName': return compare(a['userName'], b['userName'], isAsc);
        case 'ledgerDate': return compare(a['ledgerDate'], b['ledgerDate'], isAsc);
        case 'debit': return compare(a['debit'], b['debit'], isAsc);
        case 'comments': return compare(a['comments'], b['comments'], isAsc);
        case 'paymentStatus': return compare(a['paymentStatus'], b['paymentStatus'], isAsc);
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
    this.filteredData = this.corpUserLedger;
    this.dataBeforeSort = JSON.parse(JSON.stringify(this.filteredData));
    this.awardsFormControl.reset();
  }

  exportexcel(): void {
    this.itemsPerPage = this.filteredData.length;
    setTimeout(() => {
      /*name of the excel-file which will be downloaded. */
      let fileName = 'Rewards_Awarded' + new Date().valueOf() + '.xlsx';

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
