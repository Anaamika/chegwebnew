import { Component, OnInit, Input } from '@angular/core';
import { DialogService } from '@core/services/dialog.service';
import { AuthService } from '@core/services/auth.service';
import { utilities } from '@utilities/utilities';
import { impressionData } from '@app/shared/models/impression-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-gift-cards',
  templateUrl: './top-gift-cards.component.html',
  styleUrls: ['./top-gift-cards.component.scss']
})
export class TopGiftCardsComponent implements OnInit {

  @Input() topGiftCardsData;

  constructor(
    private dialogService: DialogService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('topGiftCardsData',this.router.url)
  }

  openGiftsDialog($event, data) {
    this.onVisible(data, data.productId, 'giftcard','Click');
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
      let objIndex = this.topGiftCardsData.findIndex((obj => obj.productId == $event));

      //Log object to Console.
      //console.log("Before update: ", this.topGiftCardsData[objIndex])

      //Update object's name property.
      this.topGiftCardsData[objIndex].isSale = false;
    }
  }
  onVisible(data, id, type,eventType) {
    //console.log(type, data);
    let page = this.router.url =='/'? 'home':this.router.url;
    let pageName = page.indexOf('/')>-1?page.split('/')[1]:page;
    let arrayObj = new impressionData();
    arrayObj.type = eventType;
    arrayObj.page_name = pageName+'_page';
    arrayObj.section = 'Gift Cards';
    arrayObj.id = data.productId;
    arrayObj.giftName = data.productName;
    arrayObj.idType='giftcard';
    arrayObj.name = data.productName;
    arrayObj.source = (data.giftCardSource == null || data.giftCardSource == '')?'Cheggout':data.giftCardSource;
    arrayObj.merchantID = data.siteId;
    arrayObj.merchantName = data.siteName;
    //console.log(arrayObj)
    utilities.saveImpressionDetails(arrayObj);
  }
}
