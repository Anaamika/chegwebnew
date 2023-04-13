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
  selector: 'app-terms-dialog',
  templateUrl: './terms-dialog.component.html',
  styleUrls: ['./terms-dialog.component.scss']
})
export class TermsDialogComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  bName = utilities.getBankName();
  bank = this.bName == '' ? 'cheggout' : this.bName;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      siteName: string,
      sitelogo: string,
      siteUrl: string,
      href: string,
      siteDetails: string,
      rewardTitle: string,
      rewardDescription: string,
      rewardTerms: any,
      offerTitle: string,
      offerDescription: string,
      offerTerms: string,
      cancelText: string,
      confirmText: string
    },
    private searchService: SearchService,
    private authService: AuthService,
    private mdDialogRef: MatDialogRef<TermsDialogComponent>,
    private dialogService: DialogService
  ) {

  }

  ngOnInit(): void {
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

  postProductInfo($event, data) {
    $event.stopPropagation();
    $event.preventDefault();
    console.log('here',data);
    this.onVisible(data.siteName,'Click')
    let isEligibleForCashback = utilities.isAccountTypeA();
    if (isEligibleForCashback) {
      if (this.authService.isAuthenticated() || this.authService.isGuestUSer()) {
        this.shop(data);
      } else {
        //this.confirm();else {
        utilities.addHTMLClass(['login_page']);
        const options = {
          title: 'Product',
          message: 'Verify',
          data: data,
          cancelText: 'Cancel',
          confirmText: 'Confirm'
        };

        this.dialogService.openLogin(options);
        this.dialogService.loginConfirmed().subscribe(confirmed => {
          if (confirmed) {
            //this.shop(prod);
          }
          utilities.removeHTMLClass(['login_page']);
        });
      
      }
    } else {
      this.shop(data);
    }
  }

  shop(data) {
    const model = utilities.generateProductInfoObject(data, 'Store', null);
    this.searchService.postProductInfo(model).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
      }
    }, err => {
    });
  }


  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
  onVisible(data,eventType) {
    //console.log(type, data);
    let arrayObj = new impressionData();
    arrayObj.type = eventType;
    arrayObj.page_name = 'home';
    arrayObj.idType = 'store_banner';
    arrayObj.name = data;
    //console.log(arrayObj)
    utilities.saveImpressionDetails(arrayObj);
  }

}
