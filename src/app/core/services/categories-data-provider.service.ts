import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { ApiConstants } from '@config/api-constants';
import { DataService } from '@core/services/data.service';
import { StorageService } from '@core/services/storage.service';

import { CategoriesData } from '@shared/models/categories-data'
//import { plainToClass } from "class-transformer";
import { utilities } from '@utilities/utilities';

@Injectable({
  providedIn: 'root'
})
export class CategoriesDataProviderService {

  constructor(
    private dataService: DataService,
    private storageService: StorageService,
    private router: Router,
  ) { }

  mainCategories: CategoriesData[] = [];
  subCategories: CategoriesData[] = [];
  featuredCategories = [];
  featuredCategoriesAll = [];
  topCategories: CategoriesData[] = [];
  catUID: number;
  catNode: string;
  catTitle: string;
  catLevel: number;
  catPNode: string;
  catPTitle: string;
  rootCatNode: string;
  rootCatTitle: string;
  // catImage: string;
  // catIsFav: boolean;
  catName: string = '';

  public categoriesObservable = new Subject<any>();

  public getmainCategories(): Observable<any> {
    if (this.mainCategories.length > 0) {
      return of(this.mainCategories);
    } else {
      return this.dataService.parseApiCall(
        `${ApiConstants.URL.GET_CATEGORIES}UserId=${utilities.getChegUID()}&bName=${utilities.getBankName()}`,
        'get',
        '',
        this.storageService.getTokenHeader()
      ).pipe(map((res: CategoriesData[]) => {
        if (res.length > 0) {
          //console.log(res)
          //this.mainCategories = plainToClass(CategoriesData, res);
          this.mainCategories = res;
          this.categoriesObservable.next(this.mainCategories);
          return this.mainCategories;
        }
      }));
    }
  }

  public getTopCategories(): Observable<any> {
    if (this.topCategories.length > 0) {
      return of(this.topCategories);
    } else {
      return this.dataService.parseApiCall(
        `${ApiConstants.URL.GET_TOP_CATEGORIES}UserId=${utilities.getChegUID()}&bName=${utilities.getBankName()}`,
        'get',
        '',
        this.storageService.getTokenHeader()
      ).pipe(map((res: CategoriesData[]) => {
        if (res.length > 0) {
          this.topCategories = res;
          return this.topCategories;
        }
      }));
    }
  }

  public getFeaturedCategories(): Observable<any> {
    if (this.featuredCategories.length > 0) {
      return of(this.featuredCategories);
    } else {
      return this.dataService.parseApiCall(
        `${ApiConstants.URL.GET_CUSTOM_CATEGORY}bankName=${utilities.getBankName()}`,
        'get',
        '',
        this.storageService.getTokenHeader()
      ).pipe(map((res) => {
        if (res.length > 0) {
          //console.log(res)
          this.featuredCategoriesAll = res;
          this.featuredCategories = res.filter(function (el) {
            return el.parentCatId == 0
          });
          return this.featuredCategories;
        }
      }));
    }
  }

  public getFeaturedProducts(id: number) {
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_CUSTOM_PRODUCTS}Id=${id}&bankName=${utilities.getBankName()}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  public getsubCategories(nodeId: string): Observable<any> {
    this.subCategories = [];
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_SUBCATEGORIES}parentId=${nodeId}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map((res: CategoriesData[]) => {
      if (res.length > 0) {
        //this.subCategories = plainToClass(CategoriesData, res);
        this.subCategories = res;
        return this.subCategories;
      }
    }));
  }

  public getParentCategory(nodeId: string): Observable<any> {
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_PARENT_CATEGORY}nodeId=${nodeId}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map((res: CategoriesData[]) => {
      return res;
    }));
  }

  public postFavouriteCategory(data: any) {
    return this.dataService.parseApiCall(
      ApiConstants.URL.POST_FAV_CATEGORY,
      'post',
      data,
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  public gotoCategoryPage(catUID, catNode, catTitle, rootCatNode, rootCatTitle) {
    this.router.navigate(['categories', rootCatNode, rootCatTitle, 'bestdeals', { cid: catNode, cname: catTitle, uid: catUID }]);
  }

  public gotoCategoryPagePopular(catUID, catNode, catTitle, rootCatNode, rootCatTitle, popularName) {
    this.router.navigate(['categories', rootCatNode, rootCatTitle, 'bestdeals', { cid: catNode, cname: catTitle, uid: catUID, cn: popularName }]);
  }

  public categoryInfoObservable = new Subject<number>();

  setCategoryDetails(id) {
    this.catUID = id;
    this.categoryInfoObservable.next(this.catUID);
  }

}
