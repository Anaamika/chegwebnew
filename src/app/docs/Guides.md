<style>
  hr{
    width: 100%
    border-bottom: 1px solid #ccc;
  }
  strong{
    color: #009688
  }
</style>

## HOW TO

  ### 1. Add new bank/corp to the application
  <br>
  
  - Add new condition in [utilities -> getBankName()](/classes/utilities.html#getBankName) like below code
    ```sh
      if (hostname.toLowerCase().includes('mresult')) {
      return 'MRESULT';
      }
    ```
    <br>
    
  - Add below code to get the full name in [utilities -> getBankFullName()](/classes/utilities.html#getBankFullName) 
    ```sh
        if (bankName == 'MRESULT') {
              return 'MResult';
        }
    ```
    <br>

  - Add favicon code in [utilities -> getFavicon()](/classes/utilities.html#getFavicon) 
    ```sh
      if (bankName == 'MRESULT') {
        return '../assets/images/mresult.ico';
      }
    ``` 
    <br>       

  - Add Themecolor hex code in [utilities -> getThemeColor()](/classes/utilities.html#getThemeColor) 
    ```sh
      if (bankName == 'MRESULT') {
        return '#f89738';
      }
    ```   
    <br>  

  - Add Google tracking ID code in [utilities -> getGATrackingID()](/classes/utilities.html#getGATrackingID) 
    ```sh
      if (bankName == 'MRESULT') {
        return 'UA-85495018-13';
      }
    ```  
    <br>    

  - Define custom theme variable styles in **_settings.scss**
    ```sh
      $font-family--mresult: "Jost", sans-serif;
      $theme-color--mresult: #f89738;
      $theme-primary--mresult: #f89738;
      $theme-secondary--mresult: #f89738;
      ...........
    ```   
    <br>

  - Assign variables defined in _settings.scss to a new theme configurations in **_color-themes.scss**
    ```sh
      mresult: (
          font-family: $font-family--mresult,
          theme-color: $theme-color--mresult,
          theme-primary: $theme-primary--mresult,
          theme-secondary: $theme-secondary--mresult,
          ........
      )
    ``` 
    <hr />  

  ### 2. Add new API
  <br>
   
  - Add API reference in **config/api-constants.ts** file. Call the constant variable in your services. 
    ```sh
      GET_IF_MOBILE_EXIST: `${environment.API_ENDPOINT}/CheckMobileNoExist?`
    ```
    <hr>

  ### 3. Change/Update login functionality 
   
  - Module: [core](/modules/CoreModule.html)

  - Components:  
      - For Bank: [LoginDialogComponent](/components/LoginDialogComponent.html)
      - For Corp: [LoginDialogCorpComponent](/components/LoginDialogCorpComponent.html)

  - Service: [AuthService](/injectables/AuthService.html)
    <br>
  
      **/GetUserInfo?** API in the [StartupService](/injectables/StartupService.html#load) updates most of the configuration settings in local storage. like [**isRegistration**](/classes/utilities.html#isAccountTypeA), **isReward** etc. Based on the value we are enabling or restricting login/registration functionalities in the application. For example, if isRegistration is 1 or 2 we have to enable the login and sign up feature.
      <br>

      Above components loaded when you click profile link on the page. On component load **/CheckIfVirtualIdExist?** API in [AuthService](/injectables/AuthService.html#checkIfVirtualIdExist) is called if type is Bank and [isCallingBankAPI](/classes/utilities.html#isCallingBankAPI) is TRUE. **/CheckIfVirtualIdExist?** returns mobile number if you pass valid encData from bank.
      <br>

      When you enter mobile number and press Continue 
       - **/CheckMobileNoExist?** API in [AuthService](/injectables/AuthService.html#checkIfMobileRegistered) is called if type is Bank.
       - **/CheckEmailIdExist?**  API in [AuthService](/injectables/AuthService.html#checkIfEmailRegistered) is called if type is Corp.
      <br>
        
      > if type is Bank and if [utilities.isCallingBankAPI()](/classes/utilities.html#isCallingBankAPI) returns true then call [verifyIfBankOrRegistered()](/components/LoginDialogComponent.html#verifyIfBankOrRegistered) else call [checkIfMobileRegistered()](/components/LoginDialogComponent.html#checkIfMobileRegistered)
      <br>

      Depending on the response you either show a Login screen or signup screen

      For Login: 

      - **/CheckUserNamePasswordValid?** API in [AuthService](/injectables/AuthService.html#loginBank) is called if type is Bank.
      - **/SubmitLoginForCorp?** API in [AuthService](/injectables/AuthService.html#loginCorp) is called if type is Corp.

      For Signup: 

      - **/UpdateChegUserDetails** API in [AuthService](/injectables/AuthService.html#postUserInfo) is called for both Bank and Corp.
      <br>

      > For each API responses you will be updating local storage values.
    <hr>

  ### 3. User profile, Role, Change EMail/Mobile Number, HR Module

  - Module: [user](/modules/UserModule.html)

  - Components: [MyGiftCardsComponent](/components/MyGiftCardsComponent.html), [RewardsComponent](/components/RewardsComponent.html), [RedeemComponent](/components/RedeemComponent.html)
      - For Bank: if type is Bank and if [utilities.isCallingBankAPI()](/classes/utilities.html#isCallingBankAPI) returns true then enable  [ProfileComponent](/components/ProfileComponent.html)
      - For Corp: HR Module - if **isHR** in [AuthService](/injectables/AuthService.html#isHR) returns true for the logged in user then enable [HrDashboardComponent](/components/HrDashboardComponent.html)

  - Services: [AuthService](/injectables/AuthService.html), [UserService](/injectables/UserService.html)
    <hr>

  ### 4. Add or use Dialog service

  - Create a component for a dialog in Shared module or any other module Ex: [GiftCardDialogComponent](/components/GiftCardDialogComponent.html)
    - import code:
      ```sh
        import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
      ```    
    - Add constructor:
      ```sh
        @Inject(MAT_DIALOG_DATA) public data: {
          giftCardId: number,
          cancelText: string,
          confirmText: string
        },
        private mdDialogRef: MatDialogRef<GiftCardDialogComponent>,
      ```  
    - Add close method(you can pass true/false or any other values):
      ```sh
        public close(value) {
          this.mdDialogRef.close(value);
        }
      ```   

  - Import and define the component in [DialogService](/injectables/DialogService.html)
    - import code:
      ```sh
        import { GiftCardDialogComponent } from '@shared/components/gift-card-dialog/gift-card-dialog.component';
      ```    
    - Add constructor:
      ```sh
        dialogRefGifts: MatDialogRef<GiftCardDialogComponent>;
      ```  
    - Add open and confirm close methods(open method has option/values to pass to the dialog from calling function):
      ```sh
        public openGifts(options) {
          this.dialogRefGifts = this.dialog.open(GiftCardDialogComponent, {
            data: options,
            disableClose: true
          });
        }

        public giftsConfirmed(): Observable<any> {
          return this.dialogRefGifts.afterClosed().pipe(take(1), map(res => {
            return res;
          }
          ));
        }
      ```   

  - To use dialogs, import dialog service in any component where you want to call dialogs Ex: [GiftCardsGridComponent](/components/GiftCardsGridComponent.html).  
    - call openGifts, giftsConfirmed methods from service like below:
      ```sh
        this.dialogService.openGifts(options);
        this.dialogService.giftsConfirmed().subscribe(confirmed => {
          if (confirmed) {
            //add your code
          }
        });
      ```    

  ### 3. Add, Save and track user impressions, clicks and page load.
  to track user impression we are using [IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver) API

  - Impression objects/variables initialized in [impressionData](/classes/impressionData.html) class constructor.
  - We have created [ObserveVisibilityDirective](/directives/ObserveVisibilityDirective.html) directive to track all user impressions on the page using IntersectionObserver API.
  - Add this directive to the element of which you want to track the impression. Ex: in [BannerCarouselComponent](/components/BannerCarouselComponent.html) we have added **appObserveVisibility** directive in the carousel element. Also call **(visible)** method to trigger an onVisible() event when the element appear in the viewport
    ```sh
      <div class="d-flex flex-column justify-content-center align-items-center" appObserveVisibility
        [debounceTime]="300" (visible)="onVisible(data.store, data.id, 'store')">
        <div class="banner-tile" (click)="openTermsDialog($event, data.store)"
          [ngStyle]="{'background-image': 'url(' + data.imageURL + ')'}">
        </div>
      </div>
    ```   
  - **onVisible()** method collects data to be saved and calls [saveImpressionDetails()](/classes/utilities.html#saveImpressionDetails) function in utilities class where save impression/click records to local storage is defined.(this method is for banner ad impression for category and store use different varibles from [impressionData](/classes/impressionData.html) class)
    ```sh
      onVisible(data, id, type) {
        let arrayObj = new impressionData();
        arrayObj.eventType = 'Impression';
        arrayObj.page = 'Home';
        arrayObj.section = 'Banner Ad';
        arrayObj.merchantName = data.siteName ?? data.merchantName;
        arrayObj.merchantID = data.siteID ?? data.siteId;
        arrayObj.adType = type;
        arrayObj.adID = id;
        arrayObj.adTitle = data.offerTitle ?? data.offer;
        utilities.saveImpressionDetails(arrayObj);
      }
    ```   
    > For click event, eventType is click and no need to add **appObserveVisibility** directive to the element. Just call a **saveImpressionDetails()** method with data. This is the only change you have to do for the new requirements. 

  - To send saved impressions events object to the API we have created [insertImpressionDetails()](/injectables/FooterService.html#insertImpressionDetails) in [FooterService](/injectables/FooterService.html)
  - We call this service every time when the [FooterComponent](/components/FooterComponent.html) is loaded(first time page load and every page refresh) and every 30 minutes inetrval after the component is loaded
    ```sh
      public insertImpressionDetails() {
        if (utilities.getImpressionDetails()) {
          if (utilities.getImpressionDetails().length > 10) {
            this.footerService.insertImpressionDetails().pipe(takeUntil(this.destroy$)).subscribe((res) => {
              if (res) {
                this.storageService.removeLocalStorage('impressionEvents');
              }
            },
              (err) => { }
            );
          }
        }
      }
    ```   
  
            
      


   