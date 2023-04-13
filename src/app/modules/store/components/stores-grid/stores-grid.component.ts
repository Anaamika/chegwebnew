import { Component, OnInit, Input } from '@angular/core';
import { impressionData } from '@app/shared/models/impression-data';
import { utilities } from '@app/utilities/utilities';
import { Router } from '@angular/router';
@Component({
  selector: 'app-stores-grid',
  templateUrl: './stores-grid.component.html',
  styleUrls: ['./stores-grid.component.scss']
})
export class StoresGridComponent implements OnInit {

  @Input() storesgridData;
  searchStores: string = '';

  constructor(private router: Router) { }

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
  navigateToStore(data){
    this.onVisible(data, data.siteID, 'site','Click')
    this.router.navigate(['stores', data.siteID , data.siteName]);
  }
  onVisible(data, id, type,eventType) {
    //console.log(type, data);
    let page = this.router.url =='/'? 'home':this.router.url;
    let pageName = page.indexOf('/')>-1?page.split('/')[1]:page;
    let arrayObj = new impressionData();
    arrayObj.type = eventType;
    arrayObj.page_name = pageName+'_page';
    arrayObj.section = 'Stores Ad';
    arrayObj.id = id;
    arrayObj.idType='store';
    arrayObj.merchantName = data.siteName;
    arrayObj.name = data.siteName;
    //console.log(arrayObj)
    utilities.saveImpressionDetails(arrayObj);
  }

}
