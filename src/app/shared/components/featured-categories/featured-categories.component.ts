import { Component, OnInit, Input } from '@angular/core';
import { impressionData } from '@app/shared/models/impression-data';
import { utilities } from '@app/utilities/utilities';
import { Router } from '@angular/router';
@Component({
  selector: 'app-featured-categories',
  templateUrl: './featured-categories.component.html',
  styleUrls: ['./featured-categories.component.scss']
})
export class FeaturedCategoriesComponent implements OnInit {

  @Input() featuredCatData;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  navigateTocustom(data){
    this.onVisible(data, data.id, 'Custom category','Click')
    this.router.navigate(['featured/m', data.id, data.categoryName]);
  }
  onVisible(data, id, type,eventType) {
    //console.log(type, data);
    let page = this.router.url =='/'? 'home':this.router.url;
    let pageName = page.indexOf('/')>-1?page.split('/')[1]:page;
    let arrayObj = new impressionData();
    arrayObj.type = eventType;
    arrayObj.page_name = pageName+'_page';
    arrayObj.section = 'Trending Categories';
    arrayObj.id = id;
    arrayObj.idType = 'custom_category';
    arrayObj.categoryName = data.categoryName;
    arrayObj.name = data.categoryName;
    //console.log(arrayObj)
    utilities.saveImpressionDetails(arrayObj);
  }
}
