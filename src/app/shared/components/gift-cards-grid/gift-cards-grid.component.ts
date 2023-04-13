import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { DialogService } from '@core/services/dialog.service';
import { AuthService } from '@core/services/auth.service';
import { utilities } from '@utilities/utilities';
import { Router } from '@angular/router';
import { impressionData } from '@app/shared/models/impression-data';
import { BreakpointObserver } from '@angular/cdk/layout';
@Component({
  selector: 'app-gift-cards-grid',
  templateUrl: './gift-cards-grid.component.html',
  styleUrls: ['./gift-cards-grid.component.scss']
})
export class GiftCardsGridComponent implements OnInit {
  @Input() giftCardsData;
  @Input() title;
  @Input() isRedeem;
  p: number = 1;
  searchRetailer: string = '';
  mobileView: boolean;
  dt = '2021-07-25T14:19:00'//for testing

  constructor(
    private dialogService: DialogService,
    private authService: AuthService,
    private router : Router,
    private cdr: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver    
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewChecked(): void {
    this.handleViewPort();
    this.cdr.detectChanges();
  }

  handleViewPort(): void {
    if (this.breakpointObserver.isMatched('(max-width:  767px)')) {
      this.mobileView = true;
    } else {
      this.mobileView = false;
    }
  }

  openGiftsDialog($event, data) {
    this.onVisible(data,'Click')
    $event.stopPropagation();
    $event.preventDefault();

    if (this.authService.isAuthenticated()) {
      this.openDialog(data)
    } else {
      utilities.addHTMLClass(['login_page']);
      const options = {
        title: 'Checkout',
        message: 'Login',
        cancelText: 'Cancel',
        confirmText: 'Confirm'
      };
      this.dialogService.openLogin(options);
      this.dialogService.loginConfirmed().subscribe(confirmed => {
        //console.log(confirmed)
        if (confirmed) {
          this.openDialog(data)
        }
        utilities.removeHTMLClass(['login_page']);
      });
    }
  }

  openDialog(data) {
    let options = {
      giftCardId: data.productId,
      isRedeem: this.isRedeem,
      cancelText: 'CLOSE',
      confirmText: 'YES, LEAVE PAGE'
    };
    utilities.addHTMLClass(['gift_dialog']);
    this.dialogService.openGifts(options);
    this.dialogService.giftsConfirmed().subscribe(confirmed => {
      if (confirmed) {
      }
      utilities.removeHTMLClass(['gift_dialog']);
    });
  }

  receiveTimer($event) {
    //console.log($event);
    if ($event) {
      //Find index of specific object using findIndex method.    
      let objIndex = this.giftCardsData.findIndex((obj => obj.productId == $event));

      //Log object to Console.
      //console.log("Before update: ", this.giftCardsData[objIndex])

      //Update object's name property.
      this.giftCardsData[objIndex].isSale = false;
    }
  }
  onVisible(data,eventType) {
    //console.log(type, data);
    let arrayObj = new impressionData();
    arrayObj.type = eventType;
    arrayObj.page_name ='giftcard_page';
    arrayObj.type = eventType;
    arrayObj.section = 'Gift Cards';
    arrayObj.id = data.productId;
    arrayObj.idType='giftcard';
    arrayObj.giftName = data.productName;
    arrayObj.name = data.productName;
    arrayObj.source = (data.giftCardSource == null || data.giftCardSource == '')?'Cheggout':data.giftCardSource;
    arrayObj.merchantID = data.siteId;
    arrayObj.merchantName = data.siteName;
    //console.log(arrayObj)
    utilities.saveImpressionDetails(arrayObj);
  }
  sendGift(data,isRedeem){
    this.onVisible(data,'Click');
    this.router.navigate(['gift-cards', data.productId , data.productName, {isRedeem: isRedeem}]);
  }
}
