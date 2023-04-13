import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { impressionData } from '@app/shared/models/impression-data';
import { utilities } from '@app/utilities/utilities';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
// import { OwlOptions } from 'ngx-owl-carousel-o';
// import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-tags-carousel',
  templateUrl: './tags-carousel.component.html',
  styleUrls: ['./tags-carousel.component.scss']
})
export class TagsCarouselComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  bankName: string = utilities.getBankName();

  //carousel_outer_width: string;

  @Input() popularTagsData;

  // customOptions: OwlOptions = {
  //   autoWidth: true,
  //   loop: false,
  //   margin: 10,
  //   mouseDrag: true,
  //   touchDrag: true,
  //   pullDrag: true,
  //   dots: false,
  //   navSpeed: 400,
  //   navText: ['&#10094;', '&#10095;'],
  //   nav: true,
  //   responsive: {
  //     0: {
  //       items: 1
  //     },
  //     400: {
  //       items: 2
  //     },
  //     740: {
  //       items: 3
  //     },
  //     940: {
  //       items: 4
  //     }
  //   },
  // }

  constructor(
    private router: Router
    // private cd: ChangeDetectorRef,
    // private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit() {

    // if (this.breakpointObserver.isMatched('(min-width: 1024px)')) {
    //   this.carousel_outer_width = '100%'
    // } else {
    //   let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    //   let w = window.innerWidth - scrollbarWidth;
    //   w = w - 70;
    //   this.carousel_outer_width = w + 'px'
    // }
    //this.cd.detectChanges();

  }

  onVisible(data,eventType) {
    //console.log(type, data);
    let arrayObj = new impressionData();
    arrayObj.type = eventType;
    arrayObj.page_name = 'home_page';
    arrayObj.idType='popular_search';
    arrayObj.merchantName = data.siteName;
    arrayObj.name = data.keyword;
    //console.log(arrayObj)
    utilities.saveImpressionDetails(arrayObj);
  }

  gotoSearch(obj){
    this.onVisible(obj,'Click')
    if(this.bankName === 'PNB') {
      this.router.navigate(['product', obj.keyword]);
    } else {
      this.router.navigate(['product', obj.keyword,obj.categoryId,obj.category]);
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
