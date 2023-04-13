import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { utilities } from '@utilities/utilities';
import { ActivatedRoute } from '@angular/router';
import { CategoriesDataProviderService } from '@core/services/categories-data-provider.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { gsap, TweenMax, Circ } from "gsap/all";

gsap.registerPlugin(Circ);
@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit {

  @ViewChild('filterBlock') filterBlock: ElementRef;

  @Input() categoriesSidebarData;
  @Input() productFilters;
  //@Input() filterChanged;
  @Input() filterRemoved;
  @Output() filterEvent = new EventEmitter<object>();

  mobileView: boolean = false;
  catUID: number;
  catNode: string;
  catTitle: string;
  catPNode: string;
  catPTitle: String;
  rootCatNode: string;
  rootCatTitle: string;
  catLevel: number;
  show: boolean = true;
  CategoriesData = [];

  showFilter: boolean = true;

  ngMFilter: any[] = [];
  ngMFilterMob: any[] = [];
  objFilter = {};

  arrFilter = [];

  tempArr = [];
  prevPriceFilter: string = '';
  minPrice = '';
  maxPrice = '';

  constructor(
    private categoryService: CategoriesDataProviderService,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {
    this.checkBrowserWidth();
  }

  checkBrowserWidth() {
    if (this.breakpointObserver.isMatched('(min-width: 1024px)')) {
      this.mobileView = false;
    } else {
      this.mobileView = true;
    }
  }

  ngOnChanges() {
    if (!utilities.isObjectEmpty(this.categoriesSidebarData)) {
      this.catUID = this.categoriesSidebarData.catUID;
      this.catNode = this.categoriesSidebarData.catNode;
      this.catTitle = this.categoriesSidebarData.catTitle;
      this.catPNode = this.categoriesSidebarData.catPNode;
      this.catPTitle = this.categoriesSidebarData.catPTitle;
      this.rootCatNode = this.categoriesSidebarData.rootCatNode;
      this.rootCatTitle = this.categoriesSidebarData.rootCatTitle;
      this.catLevel = this.categoriesSidebarData.catLevel;
      this.CategoriesData = this.categoriesSidebarData.Data;
      if (this.catNode === this.catPNode && this.catLevel === 1) {
        this.show = true;
      } else {
        this.show = false;
      }
      this.categoriesSidebarData = {};
    }

    this.showFilter = utilities.isObjectEmpty(this.productFilters)

    // if (!this.showFilter) {
    //   if (this.filterRemoved !== null) {
    //     utilities.removeItemOnce(this.arrFilter, this.filterRemoved)
    //     this.filterEvent.emit(this.objFilter);
    //   } 
    //   // else {
    //   //   this.filterEvent.emit(this.objFilter);
    //   // }
    // }

    //console.log(this.filterRemoved)

    if (this.filterRemoved !== null) {
      utilities.removeItemOnce(this.arrFilter, this.filterRemoved)
      this.filterEvent.emit(this.objFilter);
    } else {
      // let val: number = this.route.snapshot.paramMap.keys.length;
      // if (val > 3) {
      //   for (let i = 0; i < val; i++) {
      //     let fn = this.route.snapshot.paramMap.keys[i];
      //     if (fn != 'kw' && fn != 'cn' && fn != 'qry' && fn != 'cid' && fn != 'cname' && fn != 'uid' && fn != 'pname' && fn != 'pid') {
      //       let arr = [];
      //       let string;
      //       if (fn.toLowerCase() == 'price') {
      //         let price_filter = this.route.snapshot.paramMap.get(fn);
      //         let minPrice = price_filter.split('-')[0];
      //         let maxPrice = price_filter.split('-')[1];
      //         if (minPrice == '0') {
      //           string = 'under ₹ ' + maxPrice;
      //         } else if (maxPrice == '0') {
      //           string = 'above ₹ ' + minPrice;
      //         } else {
      //           string = '₹ ' + minPrice + ' to ₹ ' + maxPrice;
      //         }
      //         this.arrFilter.push(string);
      //         arr.push(string);
      //       } else {
      //         this.arrFilter.push((this.route.snapshot.paramMap.get(fn)).trim());
      //         arr.push((this.route.snapshot.paramMap.get(fn)).trim())
      //       }
      //       this.objFilter[fn] = arr;
      //     }
      //   }
      // } else {
      //   this.arrFilter = [];
      //   this.objFilter = {};
      // }
      // this.filterEvent.emit(this.objFilter);
    }
  }

  clearFilters(): void {
    this.objFilter = {};
    this.arrFilter = [];
    this.filterEvent.emit(this.objFilter);
  }

  isFilterSelected(data) {
    return this.arrFilter.indexOf(data) >= 0;
  }

  toggleFilters($event, key, isMobile: boolean) {
    if (key == "Price") {
      if (this.prevPriceFilter != '') {
        utilities.removeItemOnce(this.arrFilter, this.prevPriceFilter)
      }
    }
    let val = $event.source.value;
    let $checkboxes;
    setTimeout(() => {
      if (isMobile) {
        $checkboxes = Array.from(document.querySelectorAll(`[data-name="filter-mob"]`));
      } else {
        $checkboxes = Array.from(document.querySelectorAll(`[data-name="filter"]`));
      }
      this.objFilter[key] = $checkboxes
        .filter(opt => opt.getAttribute('data-key') == key && opt.classList.contains('mat-checkbox-checked'))
        .map(function (opt) { return opt.getAttribute('data-value') })
      this.filterEvent.emit(this.objFilter);
    }, 100);

    if ($event.checked) {
      this.arrFilter.push(val)
      if (key == "Price") {
        this.prevPriceFilter = val;

        let arrPrice = [];
        let value = val;
        value = value.replace(/,/g, "");  //replace comma from string
        arrPrice = value.match(/\d+/g).map(Number);  // return number from string as array Ex: if string is: ₹ 175000 to ₹ 350000; it returns [175000, 350000]
        if (arrPrice.length == 1) {
          arrPrice.unshift(0);
        }
        this.minPrice = arrPrice[0]
        this.maxPrice = arrPrice[1]
      }
    } else {
      utilities.removeItemOnce(this.arrFilter, val);
      if (key == "Price") {
        this.prevPriceFilter = ''
        this.minPrice = '';
        this.maxPrice = '';
      }
    }
  }

  triggerPriceFilter($event) {
    if (this.prevPriceFilter != '') {
      utilities.removeItemOnce(this.arrFilter, this.prevPriceFilter)
    }
    let string;
    let arr = [];
    if (this.minPrice == '0') {
      string = 'under ₹ ' + this.maxPrice;
    } else {
      string = '₹ ' + this.minPrice + ' to ₹ ' + this.maxPrice;
    }
    this.arrFilter.push(string)
    arr.push(string)
    this.objFilter['Price'] = arr;
    this.filterEvent.emit(this.objFilter);
    this.minPrice = '';
    this.maxPrice = '';
  }

  public hideFilters() {
    let elem = this.filterBlock.nativeElement;
    TweenMax.to(elem, .2, { top: '120vh', opacity: 1, ease: Circ.easeOut });
  }

  navigateToCategory(catUID: number, catNode: string, catTitle: string, isPopular: boolean, popularName: string, rootCatNode: string = '', rootCatTitle: string = '') {
    if (isPopular) {
      this.categoryService.gotoCategoryPagePopular(catUID, catNode, catTitle, this.rootCatNode, this.rootCatTitle, popularName);
    } else {
      this.categoryService.gotoCategoryPage(catUID, catNode, catTitle, this.rootCatNode, this.rootCatTitle);
    }
  }

  goBack() {
    this.categoryService.gotoCategoryPage(this.catUID, this.catPNode, this.catPTitle, this.rootCatNode, this.rootCatTitle);
  }

}
