import { HttpHeaders } from '@angular/common/http';
import { environment } from '@env/environment';

export const ApiConstants = {
  URL: {
    GET_CATEGORIES: `${environment.API_ENDPOINT}/GetFavouriteCategory?`, //?UserId=0&bName=PSB
    GET_SUBCATEGORIES: `${environment.API_ENDPOINT}/GetSubBrowseNodes?`, //?parentId=5122349031
    GET_PARENT_CATEGORY: `${environment.API_ENDPOINT}/GetParentNodeIdById?`, //?nodeId=
    GET_STORES: `${environment.API_ENDPOINT}/GetFavouriteStore?`, //?UserId=0&bName=PSB
    GET_CONTEST_STORES :  `${environment.API_ENDPOINT}/GetContestStore?`, //?UserId=0&bName=PSB
    //GET_BANNER_DATA: `${environment.API_ENDPOINT}/GetBanner?`, //?bankName=PSB
    GET_BANNER_DATA: `${environment.API_ENDPOINT}/GetDashboardBannerInfo?`, //?bankName=PSB
    GET_HOME_DATA: `${environment.API_ENDPOINT}/GetHomeApiDetails?`, //?UserId=0&bName=PSB&dType=WEB
    GET_TOP_CATEGORIES: `${environment.API_ENDPOINT}/GetTopCategorys?`, //?UserId=0&bName=BOM
    GET_TOP_STORES: `${environment.API_ENDPOINT}/GetTopStores?`, //?UserId=0&bName=BOM
    GET_TOP_PRODUCTS: `${environment.API_ENDPOINT}/GetTopTrendingProduct?`, //?
    GET_TOP_DEALS: `${environment.API_ENDPOINT}/GetTopDeals?`, //?UserId=0&bName=BOM
    GET_TOP_DEALS_BY_CATID: `${environment.API_ENDPOINT}/GetTopCouponByCategory?`, //?categoryID=2&UserID=0&bName=BOM
    GET_CUSTOM_CATEGORY: `${environment.API_ENDPOINT}/GetCustomCategory?`,
    GET_CUSTOM_PRODUCTS: `${environment.API_ENDPOINT}/GetCustomCategoryProduct?`, //?Id=catid&bankName=BOM
    GET_LAST_MODIFIED_DATE: `${environment.API_ENDPOINT}/GetLastModifiedDate?`,

    GET_AMAZON_SEARCH_RESULT: `https://completion.amazon.com/search/complete?search-alias=aps&client=amazon-search-ui&mkt=1&output=json&callback=JSONP_CALLBACK`,
    GET_BEST_SELLERS: `${environment.API_ENDPOINT}/GetBrowseNodesOnNodeId?`, //?nodeId=" + nodeId + "&searchIndex=" + cate + "&pageNo=" + page
    GET_BEST_SELLERS_FROM_SUGGESTIONS: `${environment.API_ENDPOINT}/GetBestSellerProductsFromSuggestion?`, //?nodeId=2083423031&productName=Usha Maxx Air 400mm Pedestal Fan (White)&id=87712
    GET_ALL_OFFERS: `${environment.API_ENDPOINT}/GetAllOffers?`, //?bName=PSB&userID=0
    GET_ALL_CATEGORY_OFFERS: `${environment.API_ENDPOINT}/GetOfferByCategoryId?`, //?bName=PSB&&userID=0&catId=40
    GET_ALL_STORE_OFFERS: `${environment.API_ENDPOINT}/GetOfferByStoreId?`, //?bName=PSB&userID=0&storeId=1
    GET_COMPARE_DATA: `${environment.API_ENDPOINT}/ComparePopularProducts?`, //?catName=Cat_air_conditioners&compareId=1,2
    GET_POPULAR_SEARCH_KEYWORDS: `${environment.API_ENDPOINT}/GetPopularKeywordTags?`, //

    GET_IF_MOBILE_EXIST: `${environment.API_ENDPOINT}/CheckMobileNoExist?`, //?pNum=9742030088&bName=PSB&loginId=PSB001
    GET_IF_EMAIL_EXIST: `${environment.API_ENDPOINT}/CheckEmailIdExist?`, //?pNum=9742030088&bName=PSB&loginId=PSB001
    GET_IF_USER_EXIST: `${environment.API_ENDPOINT}/CheckUserNamePasswordValid?`, // userName=9742030088&password=User@123&bankName=BOM
    POST_LOGIN_CORP: `${environment.API_ENDPOINT}/SubmitLoginForCorp?`,
    GET_IF_PIN_EXIST: `${environment.API_ENDPOINT}/CheckValidPin?`, //pin=145367&userId=15946378187128
    POST_USER_INFO: `${environment.API_ENDPOINT}/UpdateChegUserDetails`,
    GET_MOBILE_ONFORGOT: `${environment.API_ENDPOINT}/CheckMobileOnForgot?`,
    GET_EMAIL_ONFORGOT: `${environment.API_ENDPOINT}/CheckEmailOnForgot?`, //?email=
    POST_USER_PASSWORD: `${environment.API_ENDPOINT}/UpdatePassword?`,
    GET_SEND_OTP: `${environment.API_ENDPOINT}/sendOTP?`, //?pNum=&userId=
    GET_RESEND_OTP: `${environment.API_ENDPOINT}/ResendOTP?`, //?pNum=&userId=
    GET_PROFILE_INFO: `${environment.API_ENDPOINT}/GetProfileInfo?`, //?userId=
    GET_IF_VIRTUALID_EXIST: `${environment.API_ENDPOINT}/CheckIfVirtualIdExist?`, //?bName=&virtualId=
    CHECK_SESSION_ID_VALID: `${environment.API_ENDPOINT}/CheckSessionIDIsValid?`,
    CREATE_SESSION_INFO: `${environment.API_ENDPOINT}/CreateSessionInfo?`,
    UPDATE_SESSION_DEATILS: `${environment.API_ENDPOINT}/UpdateSessionDeatils?`,
    
    GET_REFRESH_TOKEN: `${environment.API_ENDPOINT}/RefreshToken?`, //?ChegCustomerId=
    POST_REFRESH_TOKEN_LOGGEDIN_USER: `${environment.API_ENDPOINT}/RefreshTokenForLoggedUser?`, //?ChegCustomerId=

    GET_ALL_USERS_BY_EMAIL: `${environment.API_ENDPOINT}/GetUsersByEmailId`, //POST Request for HR Module
    POST_EMP_REWARDS: `${environment.API_ENDPOINT}/StoreEmployeeRewardPoints`, //POST Request for HR Module
    GET_CORP_AWARDS: `${environment.API_ENDPOINT}/GetCorpAwardDetail?`, //?Corpname=’MRESULT’
    POST_IUD_AWARDS: `${environment.API_ENDPOINT}/InsertUpdateDeleteCorpAwardDetails`, //POST Request for HR Module
    GET_CORP_LEDGER: `${environment.API_ENDPOINT}/GetCorpLedger?`, //?Corpname=’MRESULT’
    GET_CORP_USER_LEDGER: `${environment.API_ENDPOINT}/GetCorpUserLedger?`, //?Corpname=’MRESULT’
    GET_CORP_GIFT_DETAILS: `${environment.API_ENDPOINT}/GetCorpGiftcardDetails?`, //?corpName=’MRESULT’
    GET_CORP_REWARD_DETAILS: `${environment.API_ENDPOINT}/GetCorpRewardDetails?`, //?corpName=’MRESULT’
    GET_ALL_USERS_DATA: `${environment.API_ENDPOINT}/GetAllUsersEmailIdDetails?`, //?corpName=’MRESULT’

    POST_IMPRESSION_DETAILS: `${environment.IMPRESSION_API_ENDPOINT}/Impression/InsertImpressionDetails`,

    GET_RAZOR_PAY_KEY: `${environment.API_ENDPOINT}/GetRazorAccountInfo?`, //?bName
    GET_TOP_GIFT_CARDS: `${environment.API_ENDPOINT}/GetTopGiftCards?`, //?bName
    GET_GIFT_CARD_BY_ID: `${environment.API_ENDPOINT}/GetGiftCardInfoByProductID?`, //?productId=23&bName=BOM
    GET_GIFT_CARDS_BY_ID: `${environment.API_ENDPOINT}/GetGiftCardsOnID?`, //?bName=BOB&id=1&type=S(store) or C(category)
    GET_ALL_GIFT_CARDS: `${environment.API_ENDPOINT}/GetAllGiftCardCoupons?`, //?bName
    GET_GIFT_CARD_CATEGORIES: `${environment.API_ENDPOINT}/GetAllGiftCardCategory?`,
    GET_GIFT_CARD_RETAILERS: `${environment.API_ENDPOINT}/GetAllGiftCardRetailer?`,
    GET_GIFT_CARD_ORDERS: `${environment.API_ENDPOINT}/GetGiftCardOrderedDetails?`, //?ChegCustomerId=0&bName=BOB
    GET_GIFT_CARD_ORDER_BY_ID: `${environment.API_ENDPOINT}/GetGiftCardOrderByID?`, //?Id=23
    POST_GIFT_CARD_ORDER: `${environment.API_ENDPOINT}/SubmitOrderRequest?`,

    POST_RAZORPAY_ORDER_ID: `${environment.API_ENDPOINT}/GetRazorpayOrderID?`,
    POST_RAZORPAY_PAYMENT_DETAILS: `${environment.API_ENDPOINT}/GetRazorpayPaymentDetails?`,

    GET_CHECK_MOB_EXIST_BANK: `${environment.API_ENDPOINT}/CheckNumberExitFromBankApi?`, //?pNum=9999999999&bName=BOB
    GET_USER_SHOPPING_TRIPS: `${environment.API_ENDPOINT}/GetUserShoppingTrips?`, //?userId=16001550203961&bName=BOB
    GET_USER_PAYMENT_DETAILS: `${environment.API_ENDPOINT}/GetUserPaymentDetails?`, //?userId=16001550203961&bName=BOB
    GET_USER_REDEEM_POINTS: `${environment.API_ENDPOINT}/GetUserRedeemPoints?`, //?userId=16001550203961&bName=BOB
    GET_PAST_TRANSACTION: `${environment.API_ENDPOINT}/GetChegTransactionInfoChegCustomerId?`, //?userId=16001550203961&bName=BOB
    POST_WITHDRAWAL_REQUEST: `${environment.API_ENDPOINT}/InsertWithdrawalRequest?`,

    GET_STORE_REWARD_DETAILS: `${environment.API_ENDPOINT}/GetDetailsOnSiteID?`, //?siteId=1&bName=CANARA
    GET_POPULAR_SEARCHES: `${environment.API_ENDPOINT}/GetPopularSearches?`, //?keyword=LG
    GET_BEST_SELLER_SEARCHES: `${environment.API_ENDPOINT}/GetBestSellerSuggestions?`, //?keyword=Usha
    GET_TRENDING_KEYWORDS: `${environment.API_ENDPOINT}/GetTrendingKeywords`, //
    GET_CATEGORY_SUGGESTIONS_ONSEARCH: `${environment.API_ENDPOINT}/GetBrowseNodesDetailsOnSearch?`, //?categoryName=
    GET_STORE_SUGGESTIONS_ONSEARCH: `${environment.API_ENDPOINT}/GetCouponStoreByKeyword?`, //?keyword=
    GET_COUPON_SUGGESTIONS_ONSEARCH: `${environment.API_ENDPOINT}/GetOfferByKeyword?`, //?keyword=

    GET_POPULAR_PRODUCTS: `${environment.API_ENDPOINT}/GetPopularProducts?`, //?keyword=LG&catName=Cat_air_conditioners
    GET_POPULAR_PRODUCTS_FILTERS: `${environment.API_ENDPOINT}/GetPopularProductFilters?`, //?category=cat_televisions
    GET_EXISTING_PRODUCT: `${environment.API_ENDPOINT}/GetSearchedProduct?`, //?productName=Mouse&bankName=CANARA
    GET_PRODUCT_SEARCH_RESULT: `${environment.API_ENDPOINT}/GetResult?`, //siteName=Amazon&productName=Chair&guid=656858758&originalKeyword=Chair&bankName=PSB
    GET_DEFAULT_SITECATEGORY: `${environment.API_ENDPOINT}/GetSitesForCategory?`,
    GET_SITE_GROUPNAME: `${environment.API_ENDPOINT}/GetSitesForGroupName?`,
    GET_USER_INFO: `${environment.API_ENDPOINT}/GetUserInfo?`, //?UserId=0&bName=PSB&loginId=C000001&pNum=
    GET_FOOTER_INFO: `${environment.API_ENDPOINT}/GetPolicyDataByBank?`, //?bName
    GET_FOOTER_CATEGORIES_FOR_SEO: `${environment.API_ENDPOINT}/GetCategorySiteList?`, //?bName
    GET_FILTERED_RESULTS: `${environment.API_ENDPOINT}/GetFilteredResult`, //method here is POST; since we have to pass lage data
    GET_POPULAR_PRODUCTS_KEYWORD: `${environment.API_ENDPOINT}/GetSearchedProductbyKeyword?`,

    POST_PRODUCT_INFO: `${environment.API_ENDPOINT}/InsertProductInfo`,
    POST_FAV_STORE: `${environment.API_ENDPOINT}/InsertUserFavouriteStore`,
    POST_FAV_CATEGORY: `${environment.API_ENDPOINT}/InsertUserFavouriteCategory`,
    POST_FAV_OFFER: `${environment.API_ENDPOINT}/UpdateLikeandDislikeCount`,
    POST_CONTACT_INFO: `${environment.API_ENDPOINT}/CreatIssueInJiraServiceDesk`,

    POST_UPDATE_MOBILE: `${environment.API_ENDPOINT}/ChangeMobileNo`,
    POST_UPDATE_EMAIL: `${environment.API_ENDPOINT}/ChangeEmailId`,
    POST_UPDATE_NAME: `${environment.API_ENDPOINT}/ChangeName`,
    SEND_EMAIL_BFSL: `${environment.API_ENDPOINT}/SendEmailForBFSL`,


  },
  STATUS_CODES: {
    SUCCESS: 20001,
    VALIDATION_ERROR: 20006,
    AUTH_ERROR: 20038,
    APP_ID_NOT_FOUND: '20023',
  },
  COMMON_HEADER: {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }),
  },
};
