import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { utilities } from '@utilities/utilities';

import { gsap, TweenMax, Circ } from "gsap/all";

gsap.registerPlugin(Circ);
@Component({
  selector: 'app-filters-sidebar',
  templateUrl: './filters-sidebar.component.html',
  styleUrls: ['./filters-sidebar.component.scss']
})
export class FiltersSidebarComponent implements OnInit {

  @ViewChild('filterBlock') filterBlock: ElementRef;
  @Input() hideStore;
  @Input() hideCategory;
  @Input() categoriesList;
  @Input() storesList;
  @Input() filterChanged;

  arrCat = [];
  arrSto = [];
  arrOffTy = [];
  arrDisc = [];
  arrCardTy = [];

  prevDiscSelected: number;

  filter: {};
  searchStores: string = '';
  searchCategories: string = '';
  bank: string = utilities.getBankName()
  @Output() filterEvent = new EventEmitter<object>();
  // @ViewChildren('chkbxCategory') private chkbxCategory: QueryList<any>;  // Import { QueryList, ViewChildren } from '@angular/core';
  // @ViewChildren('chkbxStore') private chkbxStore: QueryList<any>;
  // @ViewChildren('chkbxOfferType') private chkbxOfferType: QueryList<any>;

  constructor(
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    //this.cd.detectChanges();
    if (this.filterChanged) {
      this.sendFilter();
    }
  }

  sendFilter() {
    this.filter = {};
    this.filter["category"] = this.arrCat;
    this.filter["merchantName"] = this.arrSto;
    this.filter["couponType"] = this.arrOffTy;
    this.filter["cardType"] = this.arrCardTy;
    this.filter["discountAmount"] = this.arrDisc;
    this.filterEvent.emit(this.filter)
    //console.log(this.filter);
  }

  toggleCategory(event) {
    let item = event.source._elementRef.nativeElement.innerText
    if (event.checked) {
      this.arrCat.push(item)
    } else {
      utilities.removeItemOnce(this.arrCat, item)
    }
    //console.log(this.arrCat);
    this.sendFilter();
  }

  toggleStore(event) {
    let item = event.source._elementRef.nativeElement.innerText
    if (event.checked) {
      this.arrSto.push(item)
    } else {
      utilities.removeItemOnce(this.arrSto, item)
    }
    //console.log(this.arrSto);
    this.sendFilter();
  }

  toggleOfferType(event) {
    let item = event.source._elementRef.nativeElement.title
    if (event.checked) {
      this.arrOffTy.push(item)
    } else {
      utilities.removeItemOnce(this.arrOffTy, item)
    }
    this.sendFilter();
  }

  toggleCardType(event) {
    let item = event.source._elementRef.nativeElement.title
    if (event.checked) {
      this.arrCardTy.push(item)
    } else {
      utilities.removeItemOnce(this.arrCardTy, item)
    }
    this.sendFilter();
  }

  toggleDiscountRange(event) {
    let item = +event.source._elementRef.nativeElement.title
    if (this.prevDiscSelected != undefined) {
      utilities.removeItemOnce(this.arrDisc, this.prevDiscSelected)
    }
    if (event.checked) {
      this.arrDisc.push(item);
      this.prevDiscSelected = item;
    } else {
      utilities.removeItemOnce(this.arrDisc, item)
      this.prevDiscSelected = undefined;
    }
    this.sendFilter();
  }

  isCatSelected(data) {
    return this.arrCat.indexOf(data) >= 0;
  }

  isStoSelected(data) {
    return this.arrSto.indexOf(data) >= 0;
  }

  isOffSelected(data) {
    return this.arrOffTy.indexOf(data) >= 0;
  }

  isCardSelected(data) {
    return this.arrCardTy.indexOf(data) >= 0;
  }

  isDiscSelected(data) {
    return this.arrDisc.indexOf(data) >= 0;
  }

  clearFilters(): void {
    this.arrCat = [];
    this.arrSto = [];
    this.arrOffTy = [];
    this.arrCardTy = [];
    this.arrDisc = [];
    this.sendFilter();

    // let catCheckboxes = this.chkbxCategory.toArray();  // Not used because [checked]=isCatSelected(data)  function handles this now

    // catCheckboxes.forEach((item, index,) => {
    //   catCheckboxes[index].checked = false;
    // })

    // let stoCheckboxes = this.chkbxStore.toArray();
    // stoCheckboxes.forEach((item, index,) => {
    //   stoCheckboxes[index].checked = false;
    // })

    // let offCheckboxes = this.chkbxOfferType.toArray();

    // offCheckboxes.forEach((item, index,) => {
    //   offCheckboxes[index].checked = false;
    // })
  }

  public hideFilters() {
    let elem = this.filterBlock.nativeElement;
    TweenMax.to(elem, .2, { top: '120vh', opacity: 1, ease: Circ.easeOut });
  }

}
