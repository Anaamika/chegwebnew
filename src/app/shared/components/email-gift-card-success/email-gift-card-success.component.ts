import { Component, OnInit, Inject, HostListener, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { utilities } from '@app/utilities/utilities';
import { SearchService } from '@app/core/services/search.service';
import { AuthService } from '@core/services/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { impressionData } from '@app/shared/models/impression-data';
import { DialogService } from '@core/services/dialog.service';
@Component({
  selector: 'app-email-gift-card-success',
  templateUrl: './email-gift-card-success.component.html',
  styleUrls: ['./email-gift-card-success.component.scss']
})
export class EmailGiftCardSuccessComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  bName = utilities.getBankName();
  bank = this.bName == '' ? 'cheggout' : this.bName;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string,
      content: string,
      cancelText: string
    },
    private mdDialogRef: MatDialogRef<EmailGiftCardSuccessComponent>,
  ) {

  }

  ngOnInit(): void {
    console.log('check', this.data);
  }

  public cancel() {
    this.close(false);
  }
  public close(value) {
    this.mdDialogRef.close(value);
  }
  public confirm() {
    this.close(true);
  }
  @HostListener("keydown.esc")
  public onEsc() {
    this.close(false);
  }


  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
