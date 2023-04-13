import { Component, OnInit, Input } from '@angular/core';
import { TitleService } from '@app/core/services/title.service';
import { impressionData } from '@app/shared/models/impression-data';
import { utilities } from '@app/utilities/utilities';
import { Router } from '@angular/router';
@Component({
  selector: 'app-categories-grid',
  templateUrl: './categories-grid.component.html',
  styleUrls: ['./categories-grid.component.scss']
})
export class CategoriesGridComponent implements OnInit {

  @Input() categoriesgridData;
  searchCategories: string = '';

  constructor(private titleService:TitleService,private router: Router) { }

  ngOnInit(): void {
    this.titleService.setTitle("Save with the best price deals and top offers");
  }

  trackByCatId(index: number, category: any): string {
    return category.id;
  }

  onImgError($event) {
    console.log($event)
    let ext = utilities.getUrlExtension($event.srcElement.currentSrc)
    if (ext === 'webp') {
      $event.onerror = null;
      $event.srcElement.parentNode.children[0].srcset = $event.srcElement.parentNode.children[1].srcset = $event.srcElement.attributes.src.value;
    } else {
      $event.srcElement.parentNode.children[0].srcset = $event.srcElement.parentNode.children[1].srcset = '/assets/images/no-image.png';
    }
  }
  navigateToCategory(data){
    this.onVisible(data, data.id, 'category','Click');
    this.router.navigate(['categories', data.nodeId , data.categoryName, 'bestdeals', { cid: data.nodeId, cname: data.categoryName, uid: data.id, cn: data.popularName }])
  }
  addtoFavorites() { }
  onVisible(data, id, type,eventType) {
    //console.log(type, data);
    let page = this.router.url =='/'? 'home':this.router.url;
    let pageName = page.indexOf('/')>-1?page.split('/')[1]:page;
    let arrayObj = new impressionData();
    arrayObj.type = eventType;
    arrayObj.page_name = pageName+'_page';
    arrayObj.section = 'Categories';
    arrayObj.id = id;
    arrayObj.idType = 'category';
    arrayObj.name = data.categoryName;
    arrayObj.categoryName = data.categoryName;
    //console.log(arrayObj)
    utilities.saveImpressionDetails(arrayObj);
  }
}
