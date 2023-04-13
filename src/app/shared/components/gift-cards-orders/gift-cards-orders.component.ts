import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, Input, AfterViewChecked, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DialogService } from '@core/services/dialog.service';
import { utilities } from '@utilities/utilities';

@Component({
  selector: 'app-gift-cards-orders',
  templateUrl: './gift-cards-orders.component.html',
  styleUrls: ['./gift-cards-orders.component.scss']
})
export class GiftCardsOrdersComponent implements OnInit, AfterViewChecked {

  @Input() giftCardsData;
  public mobileView: boolean = false;
  p: number = 1;
  bankName = utilities.getBankName();

  constructor(
    private dialogService: DialogService,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {}

  ngAfterViewChecked(): void {
    this.checkBrowserWidth();
    this.cdr.detectChanges();
  }

  checkBrowserWidth() {
    if (this.breakpointObserver.isMatched('(min-width: 1024px)')) {
      this.mobileView = false;
    } else {
      this.mobileView = true;
    }
    console.log('mob', this.mobileView);
  }
  openGiftInfoDialog($event, id: number) {
    $event.stopPropagation();
    $event.preventDefault();

    let options = {
      giftCardId: id,
      cancelText: 'CLOSE',
      confirmText: 'YES, LEAVE PAGE'
    };
    utilities.addHTMLClass(['gift_dialog']);
    this.dialogService.openGiftInfo(options);
    this.dialogService.giftInfoConfirmed().subscribe(confirmed => {
      if (confirmed) {
        //console.log(confirmed)
      }
      utilities.removeHTMLClass(['login_page']);
    });
  }

}
