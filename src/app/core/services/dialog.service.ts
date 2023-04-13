import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginDialogComponent } from '@core/layouts/components/login-dialog/login-dialog.component';
import { LoginDialogCorpComponent } from '@core/layouts/components/login-dialog-corp/login-dialog-corp.component';
import { RedeemCreditsDialogComponent } from '@module/user/components/redeem-credits-dialog/redeem-credits-dialog.component';
import { AddAwardsDialogComponent } from '@module/user/components/add-awards-dialog/add-awards-dialog.component';
import { TermsDialogComponent } from '@shared/components/terms-dialog/terms-dialog.component';
import { OfferInfoDialogComponent } from '@shared/components/offer-info-dialog/offer-info-dialog.component';
import { GiftCardDialogComponent } from '@shared/components/gift-card-dialog/gift-card-dialog.component';
import { GiftInfoDialogComponent } from '@shared/components/gift-info-dialog/gift-info-dialog.component';
import { utilities } from '@utilities/utilities';
import { EmailGiftCardSuccessComponent } from '@app/shared/components/email-gift-card-success/email-gift-card-success.component';
import { NotifyDialogComponent } from '@app/shared/components/notify-dialog/notify-dialog.component';
@Injectable({
  providedIn: 'root'
})
export class DialogService {
  dialogOpen = false;

  dialogRefNotify: MatDialogRef<NotifyDialogComponent>;
  dialogRefLogin: MatDialogRef<LoginDialogComponent>;
  dialogRefLoginCorp: MatDialogRef<LoginDialogCorpComponent>;
  dialogRefRedeemCred: MatDialogRef<RedeemCreditsDialogComponent>;
  dialogAddAwards: MatDialogRef<AddAwardsDialogComponent>;
  dialogRefTerms: MatDialogRef<TermsDialogComponent>;
  dialogRefGifts: MatDialogRef<GiftCardDialogComponent>;
  dialogRefGiftInfo: MatDialogRef<GiftInfoDialogComponent>;
  dialogRefOfferInfo: MatDialogRef<OfferInfoDialogComponent>;
  dialogEmailSuccess: MatDialogRef<EmailGiftCardSuccessComponent>;
  
  constructor(private dialog: MatDialog) { }

    //Notify Dialog
    public openNotify(options) {
      this.dialogRefNotify = this.dialog.open(NotifyDialogComponent, {
        data: options,
        disableClose: true
      });
    }
  
    public closeNotify(): Observable<any> {
      return this.dialogRefNotify.afterClosed().pipe(take(1), map(res => {
        return res;
      }
      ));
    }

  //Login Dialog
  public openLogin(options) {
    let type = utilities.getType();
    if(!this.dialogOpen){
      this.dialogOpen = true;
      if (type === 'Bank') {
        this.dialogRefLogin = this.dialog.open(LoginDialogComponent, {
          data: {
            title: options.title,
            message: options.message,
            data: options.data,
            cancelText: options.cancelText,
            confirmText: options.confirmText
          }
        });
      } else {
        this.dialogRefLoginCorp = this.dialog.open(LoginDialogCorpComponent, {
          data: {
            title: options.title,
            message: options.message,
            data: options.data,
            cancelText: options.cancelText,
            confirmText: options.confirmText
          }
        });
      }
    }
  }

  public loginConfirmed(): Observable<any> {
    let type = utilities.getType();
    if (type === 'Bank') {
      return this.dialogRefLogin.afterClosed().pipe(take(1), map(res => {
        this.dialogOpen = false;
        utilities.removeBodyClass(['login_page']);
        return res;
      }));
    } else {
      return this.dialogRefLoginCorp.afterClosed().pipe(take(1), map(res => {
        this.dialogOpen = false;
        utilities.removeBodyClass(['login_page']);
        return res;
      }));
    }

  }

  //Terms Dialog
  public openTerms(options) {
    this.dialogRefTerms = this.dialog.open(TermsDialogComponent, {
      data: options
    });
  }

  public termsConfirmed(): Observable<any> {
    return this.dialogRefTerms.afterClosed().pipe(take(1), map(res => {
      return res;
    }
    ));
  }

  //GiftCard Dialog
  public openGifts(options) {
    this.dialogRefGifts = this.dialog.open(GiftCardDialogComponent, {
      data: options,
      disableClose: true
    });
  }

  public giftsConfirmed(): Observable<any> {
    return this.dialogRefGifts.afterClosed().pipe(take(1), map(res => {
      return res;
    }
    ));
  }

  //GiftCard Info Dialog
  public openGiftInfo(options) {
    this.dialogRefGiftInfo = this.dialog.open(GiftInfoDialogComponent, {
      data: options,
    });
  }

  public giftInfoConfirmed(): Observable<any> {
    return this.dialogRefGiftInfo.afterClosed().pipe(take(1), map(res => {
      return res;
    }
    ));
  }

  //Offer Info Dialog
  public openOfferInfo(options) {
    this.dialogRefOfferInfo = this.dialog.open(OfferInfoDialogComponent, {
      data: options
    });
  }

  public offerInfoConfirmed(): Observable<any> {
    return this.dialogRefOfferInfo.afterClosed().pipe(take(1), map(res => {
      return res;
    }
    ));
  }

  //Redeem Credits Dialog
  public openRedeemCredits(options) {
    this.dialogRefRedeemCred = this.dialog.open(RedeemCreditsDialogComponent, {
      data: {
        eWalletBalance: options.eWalletBalance,
      }
    });
  }

  public redeemCreditsConfirmed(): Observable<any> {
    return this.dialogRefRedeemCred.afterClosed().pipe(take(1), map(res => {
      return res;
    }
    ));
  }

  //Add/Update Awards Dialog
  public openAddAwards(options) {
    this.dialogAddAwards = this.dialog.open(AddAwardsDialogComponent, {
      data: options
    });
  }

  public addAwardsConfirmed(): Observable<any> {
    return this.dialogAddAwards.afterClosed().pipe(take(1), map(res => {
      return res;
    }
    ));
  }

    //Add/Update Awards Dialog
    public openGiftCardSuccess(options) {
      this.dialogEmailSuccess = this.dialog.open(EmailGiftCardSuccessComponent, {
        data: options
      });
    }

  public emailGiftCardSuccess(): Observable<any> {
    return this.dialogEmailSuccess.afterClosed().pipe(take(1), map(res => {
      return res;
    }
    ));
  }
}
