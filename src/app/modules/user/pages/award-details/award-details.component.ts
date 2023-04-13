import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { DialogService } from '@core/services/dialog.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, NavigationStart } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-award-details',
  templateUrl: './award-details.component.html',
  styleUrls: ['./award-details.component.scss']
})
export class AwardDetailsComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  awardsList: string[] = [];
  awardDisplayColumns: string[] = ['awardTitle', 'action'];

  awardsFormControl = new FormControl('', [
    Validators.required,
  ]);

  constructor(
    private userService: UserService,
    private dialogService: DialogService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        const el = document.querySelector('.breadcrumb');
        el.querySelectorAll(".hr").forEach(el => el.remove());
      }
    });
  }

  ngOnInit(): void {
    this.getCorpAwards();

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

  getCorpAwards() {
    this.userService.getCorpAwards().pipe(takeUntil(this.destroy$)).subscribe(res => {
      //console.log(res)
      if (res.length > 0) {
        this.awardsList = res;
      }
    }, err => {
    });
  }

  addAward(event) {
    const options = {
      opType: 'I',
      data: null
    };

    this.dialogService.openAddAwards(options);
    this.dialogService.addAwardsConfirmed().subscribe(confirmed => {
      if (confirmed) {
        this.getCorpAwards();
      }
    });
  }

  editAward(event, data) {
    const options = {
      opType: 'U',
      data: data
    };

    this.dialogService.openAddAwards(options);
    this.dialogService.addAwardsConfirmed().subscribe(confirmed => {
      if (confirmed) {
        this.getCorpAwards();
      }
    });
  }

  public deleteAward(event, data) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'you want to delete "' + data.awardTitle + '"?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const model = {
          Id: data.id,
          CorpName: data.corpName,
          CorpUserId: data.corpUserId,
          AwardTitle: data.awardTitle,
          OpType: 'D'
        }
        this.userService.corpAwardsIUD(model).pipe(takeUntil(this.destroy$)).subscribe(res => {
          this._snackBar.open('Award has been deleted', '', {
            duration: 5000,
            panelClass: ['green-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.getCorpAwards();
        }, err => {
        });
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
