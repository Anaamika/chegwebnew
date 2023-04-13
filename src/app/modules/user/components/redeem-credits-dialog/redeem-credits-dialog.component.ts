import { Component, OnInit, Inject, OnDestroy, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UserService } from '@core/services/user.service';
import { utilities } from '@app/utilities/utilities';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-redeem-credits-dialog',
  templateUrl: './redeem-credits-dialog.component.html',
  styleUrls: ['./redeem-credits-dialog.component.scss']
})
export class RedeemCreditsDialogComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  walletBalance: number = 0;

  //For Validation
  ammountFormControl = new FormControl('');

  constructor(
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data,
    private mdDialogRef: MatDialogRef<RedeemCreditsDialogComponent>,
    private _snackBar: MatSnackBar
  ) {
    console.log(data)
    this.walletBalance = data.eWalletBalance;
    this.ammountFormControl.setValidators([Validators.required, Validators.max(this.walletBalance)])
  }

  ngOnInit(): void {
  }

  public withdrawAmmount() {
    if (this.ammountFormControl.status == "VALID") {
      const model = {
        BankUserId: utilities.getBankID(),
        BankName: utilities.getBankName(),
        ChegUserId: utilities.getChegUID(),
        WithDrawalAmt: this.ammountFormControl.value
      }

      this.userService.withdrawAmmount(model)
        .pipe(takeUntil(this.destroy$)).subscribe(res => {
          console.log(res)
          this._snackBar.open('Your withdrawal request has been submitted', '', {
            duration: 5000,
            panelClass: ['blue-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.confirm();
        }, err => {
        });
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
