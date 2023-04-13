import { Component, OnInit, Inject, HostListener, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { utilities } from '@app/utilities/utilities';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-notify-dialog',
  templateUrl: './notify-dialog.component.html',
  styleUrls: ['./notify-dialog.component.scss']
})
export class NotifyDialogComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  bName = utilities.getBankName();
  bank = this.bName == '' ? 'cheggout' : this.bName;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string,
      message1: string,
      message2: string,
    },
    private mdDialogRef: MatDialogRef<NotifyDialogComponent>) {
      this.mdDialogRef.disableClose = true;
   }

  ngOnInit(): void {
  }

  // public cancel() {
  //   this.close(false);
  // }
  // public close(value) {
  //   this.mdDialogRef.close(value);
  // }
  // public confirm() {
  //   this.close(true);
  // }
  // @HostListener("keydown.esc")
  // public onEsc() {
  //   this.close(false);
  // }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
