import { Component, Input, OnInit } from '@angular/core';
import { utilities } from '@app/utilities/utilities';
import { AuthService } from '@core/services/auth.service';
import { DialogService } from '@core/services/dialog.service';
import { SearchService } from '@app/core/services/search.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-store-grid',
  templateUrl: './store-grid.component.html',
  styleUrls: ['./store-grid.component.scss']
})
export class StoreGridComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  @Input() storesgridData;
  searchStores: string = '';

  constructor(
    private dialogService: DialogService,
    private searchService: SearchService,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  trackBystoreId(index: number, store: any): string {
    return store.siteID;
  }

  onImgError($event) {
    let ext = utilities.getUrlExtension($event.srcElement.currentSrc)
    if (ext === 'webp') {
      $event.onerror = null;
      $event.srcElement.parentNode.children[0].srcset = $event.srcElement.parentNode.children[1].srcset = $event.srcElement.attributes.src.value;
    } else {
      $event.srcElement.parentNode.children[0].srcset = $event.srcElement.parentNode.children[1].srcset = '/assets/images/no-image.png';
    }
  }
  postProductInfo($event, data) {
    $event.stopPropagation();
    $event.preventDefault();
    let isEligibleForCashback = utilities.isAccountTypeA();
    if (isEligibleForCashback) {

      if (this.authService.isAuthenticated() || this.authService.isGuestUSer()) {
        this.shop(data);
      } else {
        this.login(data);
      }

    } else {
      this.shop(data);
    }
  }
  login(data) {
    utilities.addHTMLClass(['login_page']);
    const options = {
      title: 'Store',
      message: 'Verify',
      data: data,
      cancelText: 'Cancel',
      confirmText: 'Confirm'
    };

    this.dialogService.openLogin(options);
    this.dialogService.loginConfirmed().subscribe(confirmed => {
      if (confirmed) {
        //this.shop(data);
      }
      utilities.removeHTMLClass(['login_page']);
    });
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

}
