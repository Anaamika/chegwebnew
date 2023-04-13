import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
//import { Jsonp } from '@angular/http';

import { ApiConstants } from '@config/api-constants';
import { DataService } from '@core/services/data.service';
import { StorageService } from '@core/services/storage.service';
import { AppConstants } from '@app/config/app-constants';
import { utilities } from '@utilities/utilities';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private dataService: DataService,
    private storageService: StorageService,
    //private jsonp: Jsonp,
    private httpClient: HttpClient
  ) { }


  getamazonSuggestionsOnSearch(data: string) {
    return this.httpClient.jsonp(`${ApiConstants.URL.GET_AMAZON_SEARCH_RESULT}&q=${data}`, 'callback')
      .pipe(map(res => {
        return res;
      }));
  }

  getTrendingKeywords() {
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_TRENDING_KEYWORDS}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

 getPopularTags() {
  return this.dataService.parseApiCall(`${ApiConstants.URL.GET_POPULAR_SEARCH_KEYWORDS}`,
      'get',
      '',
      this.storageService.getTokenHeader()
      ).pipe(map(res => {
        return res;
      }));
  }

  getPopularSuggestionsOnSearch(data: string) {
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_POPULAR_SEARCHES}keyword=${data}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  getKeywordSuggestionsOnSearch(data: string) {
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_POPULAR_SEARCH_KEYWORDS}keyword=${data}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }


  getBestSellerSuggestionsOnSearch(data: string) {
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_BEST_SELLER_SEARCHES}keyword=${data}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }


  getCategorySuggestionsOnSearch(data: string) {
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_CATEGORY_SUGGESTIONS_ONSEARCH}categoryName=${data}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  getStoreSuggestionsOnSearch(data: string) {
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_STORE_SUGGESTIONS_ONSEARCH}keyword=${data}&bName=${utilities.getBankName()}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  getCouponSuggestionsOnSearch(data: string) {
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_COUPON_SUGGESTIONS_ONSEARCH}keyword=${data}&bName=${utilities.getBankName()}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  getDefaultSiteByCategory(data: string) {
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_DEFAULT_SITECATEGORY}id=${data}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  getSiteByGroupName(data: string) {
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_SITE_GROUPNAME}ProductName=${data}&bankName=${utilities.getBankName()}&dType=${AppConstants.DEVICE_TYPE.NAME}&groupName=${data}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  getExistingProduct(data: string) {
    let chegId = utilities.getChegUID() == null ? 0 : utilities.getChegUID();
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_EXISTING_PRODUCT}productName=${data}&bankName=${utilities.getBankName()}&chegCustomerId=${chegId}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  getBestSellers(nodeId, searchIndex, pageNo) {
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_BEST_SELLERS}nodeId=${nodeId}&searchIndex=${searchIndex}&pageNo=${pageNo}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  getBestSellersFromSuggestion(nodeId, prodName, prodId, pageNo) {
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_BEST_SELLERS_FROM_SUGGESTIONS}nodeId=${nodeId}&productName=${prodName})&id=${prodId}&PageNo=${pageNo}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  getPopularProducts(data: any) {
    return this.dataService.parseApiCall(
      ApiConstants.URL.GET_POPULAR_PRODUCTS,
      'post',
      data,
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  getPopularProductsFilters(cn) {
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_POPULAR_PRODUCTS_FILTERS}category=${cn}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  getFilteredProducts(model: any) {
    return this.dataService.parseApiCall(
      ApiConstants.URL.GET_FILTERED_RESULTS,
      'post',
      model,
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  getproductSearchResult(siteName: string, data: string, guid: string, groupName: string) {
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_PRODUCT_SEARCH_RESULT}siteName=${siteName}&productName=${data}&guid=${guid}&originalKeyword=${data}&bankName=${utilities.getBankName()}&groupName=${groupName}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  getStoreRewardDetails(siteId) {
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_STORE_REWARD_DETAILS}siteId=${siteId}&bName=${utilities.getBankName()}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

  postProductInfo(data: any) {
    const model: any = {...data, sessionId: this.storageService.getSessionStorage('sessionId')}
    return this.dataService.parseApiCall(
      ApiConstants.URL.POST_PRODUCT_INFO,
      'post',
      model,
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }
  GetSearchedProductbyKeyword(data){
    let chegId = utilities.getChegUID() == null ? 0 : utilities.getChegUID();
    return this.dataService.parseApiCall(
      `${ApiConstants.URL.GET_POPULAR_PRODUCTS_KEYWORD}productName=${data}&bankName=${utilities.getBankName()}&chegCustomerId=${chegId}`,
      'get',
      '',
      this.storageService.getTokenHeader()
    ).pipe(map(res => {
      return res;
    }));
  }

}

