import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { utilities } from '@utilities/utilities';
import { gsap, TweenMax, Circ } from "gsap/all";

gsap.registerPlugin(Circ);
@Component({
  selector: 'app-gift-cards-filter',
  templateUrl: './gift-cards-filter.component.html',
  styleUrls: ['./gift-cards-filter.component.scss']
})
export class GiftCardsFilterComponent implements OnInit {

  categoriesData = [];
  retailersData = [];
  @Input() categoriesList;
  @Input() retailersList;

  @Output() filterEvent = new EventEmitter<object>();
  @ViewChild('filterBlock') filterBlock: ElementRef;

  searchCategory;
  searchRetailer;

  filter = {};
  arrFilter = [];
  prevCategorySelected: number;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    //console.log(this.retailersList)
    if (this.categoriesList.length > 0) {
      this.categoriesData = this.categoriesList;
    }

    if (this.retailersList.length > 0) {
      this.retailersData = this.retailersList;
    }
  }

  isFilterSelected(data) {
    return this.arrFilter.indexOf(data) >= 0;
  }

  toggleFilters($event, key, isMobile: boolean) {
    let val = $event.source.name;
    let title = $event.source.value;
    if (this.prevCategorySelected != undefined) {
      utilities.removeItemOnce(this.arrFilter, this.prevCategorySelected)
    }

    if ($event.checked) {
      this.arrFilter.push(val)
      this.prevCategorySelected = val;
    } else {
      utilities.removeItemOnce(this.arrFilter, val);
      this.prevCategorySelected = undefined
    }
    this.sendFilter(key, title);
  }

  sendFilter(key, title) {
    this.filter = {};
    this.filter['title'] = title;
    this.filter[key] = this.arrFilter.map(String);
    this.filterEvent.emit(this.filter)
    //console.log(this.filter);
  }


  public hideFilters() {
    let elem = this.filterBlock.nativeElement;
    TweenMax.to(elem, .2, { top: '120vh', opacity: 1, ease: Circ.easeOut });
  }

  clearFilters(): void {
    this.filter = {};
    this.arrFilter = [];
    this.filterEvent.emit(this.filter);
  }

}
