import { Component, OnInit, Inject, OnDestroy, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserService } from '@core/services/user.service';
import { utilities } from '@app/utilities/utilities';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-awards-dialog',
  templateUrl: './add-awards-dialog.component.html',
  styleUrls: ['./add-awards-dialog.component.scss']
})
export class AddAwardsDialogComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  awardsList: string[] = [];

  awardFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)
  ]);

  title: string = '';
  opType: string = 'I';
  constructor(
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data,
    private mdDialogRef: MatDialogRef<AddAwardsDialogComponent>,
    private _snackBar: MatSnackBar
  ) {
    this.opType = data.opType;

    if (this.opType == "I") {
      this.title = "Add New Award"
    } else {
      this.title = "Edit Award"
      this.awardFormControl.setValue(this.data.data.awardTitle);
    }

  }

  ngOnInit(): void {
    this.awardsList = this.userService.awardsList;
  }

  enterEvent(event) {
    if (this.awardFormControl.status == "VALID") {
      if (this.opType == 'I') {
        this.addAwardTitle();
      } else {
        this.editAwardTitle();
      }
    }
  }

  public addAwardTitle() {
    if (this.awardFormControl.status == "VALID") {
      let data = this.awardsList.filter(item => item['awardTitle'].toLowerCase() == this.awardFormControl.value);
      if (data.length) {
        this._snackBar.open('Award already exist. Please try with another name', '', {
          duration: 5000,
          panelClass: ['red-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.awardFormControl.reset();
      } else {
        const model = {
          Id: 0,
          CorpName: utilities.getBankName(),
          CorpUserId: utilities.getBankName() + '001',
          AwardTitle: this.awardFormControl.value,
          OpType: 'I'
        }

        this.userService.corpAwardsIUD(model).pipe(takeUntil(this.destroy$)).subscribe(res => {
          this._snackBar.open('Award added successfully', '', {
            duration: 5000,
            panelClass: ['green-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.confirm();
        }, err => {
        });
      }
    }
  }

  public editAwardTitle() {
    if (this.awardFormControl.status == "VALID") {
      let data = this.awardsList.filter(item => item['awardTitle'].toLowerCase() == this.awardFormControl.value);
      if (data.length) {
        this._snackBar.open('Award already exist. Please try with another name', '', {
          duration: 5000,
          panelClass: ['red-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.awardFormControl.reset();
      } else {
        const model = {
          Id: this.data.data.id,
          CorpName: this.data.data.corpName,
          CorpUserId: this.data.data.corpUserId,
          AwardTitle: this.awardFormControl.value,
          OpType: 'U'
        }

        this.userService.corpAwardsIUD(model).pipe(takeUntil(this.destroy$)).subscribe(res => {
          this._snackBar.open('Award updated successfully', '', {
            duration: 5000,
            panelClass: ['green-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.confirm();
        }, err => {
        });
      }
    }
  }

  public cancel() {
    this.close(false);
  }
  public confirm() {
    this.close(true);
  }
  @HostListener("keydown.esc")
  public onEsc() {
    this.close(false);
  }

  public close(value) {
    this.mdDialogRef.close(value);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
