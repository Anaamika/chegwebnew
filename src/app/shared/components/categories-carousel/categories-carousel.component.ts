import { Component, OnInit, Input } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { impressionData } from '@shared/models/impression-data'
import { utilities } from '@app/utilities/utilities';
import { Router } from '@angular/router';
@Component({
  selector: 'app-categories-carousel',
  templateUrl: './categories-carousel.component.html',
  styleUrls: ['./categories-carousel.component.scss']
})
export class CategoriesCarouselComponent implements OnInit {

  @Input() categoriesData;
  customOptions: OwlOptions = {
    margin: 20,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 800,
    navText: ['', ''],
    responsive: {
      0: {
        items: 3
      },
      400: {
        items: 3
      },
      420: {
        items: 4
      },
      740: {
        items: 5
      },
      940: {
        items: 6
      },
      1024: {
        items: 6
      }
    },
    nav: false,
    //stagePadding: 30,
  }
  constructor(private router: Router) { }

  navigateToCategory(data){
    this.onVisible(data, data.id, 'category','Click')
    this.router.navigate(['/categories/', data.nodeId , data.categoryName, 'bestdeals', { cid: data.nodeId, cname: data.categoryName, uid: data.id, cn: data.popularName }]);
  }
  ngOnInit(): void {
  }
  onVisible(data, id, type,eventType) {
    //console.log(type, data);
    let page = this.router.url =='/'? 'home':this.router.url;
    let pageName = page.indexOf('/')>-1?page.split('/')[1]:page;
    let arrayObj = new impressionData();
    arrayObj.type = eventType;
    arrayObj.page_name = pageName+'_page';
    arrayObj.section = 'Top Categories';
    arrayObj.id = id;
    arrayObj.idType = 'category';
    arrayObj.categoryName = data.categoryName;
    arrayObj.name = data.categoryName;
    utilities.saveImpressionDetails(arrayObj);
  }
}
