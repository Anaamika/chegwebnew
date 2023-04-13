import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { utilities } from '@app/utilities/utilities';
import { SearchService } from '@app/core/services/search.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppConstants } from '@app/config/app-constants';
import { StorageService } from '@core/services/storage.service';
import { AuthService } from '@core/services/auth.service';
import { DialogService } from '@core/services/dialog.service';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { CompareBottomsheetComponent } from '../compare-bottomsheet/compare-bottomsheet.component'
import { impressionData } from '@app/shared/models/impression-data';
@Component({
  selector: 'app-best-sellers-grid',
  templateUrl: './best-sellers-grid.component.html',
  styleUrls: ['./best-sellers-grid.component.scss']
})
export class BestSellersGridComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  @Input() bestsellersData;
  @Input() instance;
  @Input() page;
  @Input() catName;
  p: number[] = []; //For multiple instance of same component

  arrForCompare = [];
  arrForCompareData = [];
  selected = 'REL';

  constructor(
    private cd: ChangeDetectorRef,
    private searchService: SearchService,
    private storageService: StorageService,
    private authService: AuthService,
    private dialogService: DialogService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _bottomSheet: MatBottomSheet,
  ) { }

  ngOnInit(): void {
    let addtoCompareID = this.storageService.getLocalStorage('addtoCompareID');
    let addtoCompareData = this.storageService.getLocalStorage('addtoCompareData');
    this.arrForCompare = addtoCompareID == null ? [] : addtoCompareID;
    this.arrForCompareData = addtoCompareData == null ? [] : addtoCompareData;
  }

  ngOnChanges() {
    //console.log(this.bestsellersData)
    this.bestsellersData.sort(utilities.sortBY('relevanceNo', 'asc'))
  }

  postProductInfo($event, prod) {
    //console.log($event)
    this.onVisible(prod, prod.id, 'products','Click')
    let isEligibleForCashback = utilities.isAccountTypeA();
    if (isEligibleForCashback) {
      if (this.authService.isAuthenticated() || this.authService.isGuestUSer()) {
        this.shop(prod);
      } else {
        utilities.addHTMLClass(['login_page']);
        const options = {
          title: 'Product',
          message: 'Verify',
          data: prod,
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
      this.shop(prod);
    }
  }

  public shop(data) {
    //console.log(data)
    const model = utilities.generateProductInfoObject(data, 'Product', null);
    this.searchService.postProductInfo(model).pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res) {
      }
    }, err => {
    });
  }

  public compare(data) {
    this.onVisible(data, data.id, 'products','Click');
    this.storageService.setLocalStorage('compareData', data);//not used anymore; it was adding this product in search result by default
  }

  public toggleAddToCompare(event, data) {
    if (this.arrForCompareData.length > 3 && event.checked) {
      let snackbar = this._snackBar.open('You have already selected 4 products.', 'Clear list', {
        duration: 3000,
        panelClass: ['yellow-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      snackbar.onAction().subscribe(() => this.removeAll());
      event.source._checked = false;
    } else {
      let isSimilar = true;
      let category = decodeURIComponent(this.route.snapshot.paramMap.get('cn'));
      if (this.arrForCompareData.length > 0) {
        if (category === this.arrForCompareData[0].category) {
          isSimilar = true;
        } else {
          isSimilar = false
        }
      }

      if (isSimilar) {
        let obj = {};
        obj['id'] = data.id;
        obj['title'] = data.productName;
        obj['img'] = data.imgSrc;
        obj['category'] = category;

        if (event.checked) {
          this.arrForCompare.push(data.id);
          this.arrForCompareData.push(obj);
        } else {
          utilities.removeItemOnce(this.arrForCompare, data.id)
          utilities.removeObjByAttr(this.arrForCompareData, 'id', data.id)
        }
        this.storageService.setLocalStorage('addtoCompareID', this.arrForCompare)
        this.storageService.setLocalStorage('addtoCompareData', this.arrForCompareData)
      } else {
        let snackbar = this._snackBar.open('You can only compare similar products.', 'Clear list', {
          duration: 3000,
          panelClass: ['yellow-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        snackbar.onAction().subscribe(() => this.removeAll());
        event.source._checked = false;
      }
    }
  }

  isSelectedForCompare(data) {
    return this.arrForCompare.indexOf(data) >= 0;
  }

  compareProducts() {
    let obj: any = [];
    obj['cn'] = decodeURIComponent(this.route.snapshot.paramMap.get('cn'));
    obj['ids'] = this.arrForCompare.toString();
    let title = decodeURIComponent(this.route.snapshot.paramMap.get('qry'));
    this.router.navigate(['compare/', title, obj]);
    //this._bottomSheet.open(CompareBottomsheetComponent);
  }

  clearCompareData(id) {
    utilities.removeItemOnce(this.arrForCompare, id)
    utilities.removeObjByAttr(this.arrForCompareData, 'id', id)
    this.storageService.setLocalStorage('addtoCompareID', this.arrForCompare)
    this.storageService.setLocalStorage('addtoCompareData', this.arrForCompareData)
  }

  removeAll() {
    this.arrForCompare = [];
    this.arrForCompareData = [];
    this.storageService.setLocalStorage('addtoCompareID', this.arrForCompare)
    this.storageService.setLocalStorage('addtoCompareData', this.arrForCompareData)
  }

  toggleBestDeals(val) {
    //console.log(val)
    if (val == 'LTH') {
      this.bestsellersData.sort(utilities.sortBY('price', 'asc'))
    } else if (val == 'HTL') {
      this.bestsellersData.sort(utilities.sortBY('price', 'desc'))
    } else if (val == 'REL') {
      this.bestsellersData.sort(utilities.sortBY('relevanceNo', 'asc'))
    }
  }
  navigateToProduct(data,page,catName){
    this.onVisible(data, data.id, 'products','Click')
    this.router.navigate(['product', data.productName, { page: page, store: data.siteName,catName:catName }])
  }
  onVisible(data, id, type,eventType) {

    //console.log(type, data);
    let page = this.router.url =='/'? 'home':this.router.url;
    let pageName = page.indexOf('/')>-1?page.split('/')[1]:page;
    let arrayObj = new impressionData();
    arrayObj.type = eventType;
    arrayObj.page_name = pageName+'_page';
    arrayObj.section = 'Best Sellers';
    arrayObj.id = id;
    arrayObj.idType = this.catName == undefined?'similar_product':'best_seller';
    arrayObj.productName = data.productName;
    arrayObj.merchantName = data.siteName;
    arrayObj.name = data.productName;
    console.log(arrayObj)
    utilities.saveImpressionDetails(arrayObj);
  }
}
