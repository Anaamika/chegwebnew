declare global {
  interface Window { opr: any; opera: any; chrom: any; }
}

window.opr = window.opr || {};
window.opera = window.opera || {};
window.chrom = window.chrom || {}; //For Browser Detect

const body = document.getElementsByTagName('body')[0];
const html = document.getElementsByTagName('html')[0];

/**
 * All utility functions added here
 */
export class utilities {

  /**
   * Check if empty
   */
  static isEmpty(data: any) {
    return !data;
  }

  /**
   * Check if function
   */
  static isFunction(data) {
    return typeof data === 'function';
  }

  /**
   * Check if number
   */
  static isNumber(data) {
    return typeof data === 'number';
  }

  /**
   * Check if object
   */
  static isObject(data) {
    return typeof data === 'object';
  }

  /**
   * Check if string
   */
  static isString(data) {
    return typeof data === 'string';
  }

  /**
   * Check if array
   */
  static isArray(data) {
    return Array.isArray(data);
  }

  /**
   * Check if array is empty
   */
  static isArrayEmpty(arr) {
    return !(arr && arr.length);
  }

  /**
   * Check if object is empty
   */
  static isObjectEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  /**
   * Remove duplicates from an array
   */
  static getUniqueArray(arr) {
    var a = [];
    for (var i = 0, l = arr.length; i < l; i++)
      if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
        a.push(arr[i]);
    return a;
  }

  /**
   * Remove duplicates from json array object
   */
  static getUniqueJasonObj(arr, key) {
    return [
      ...new Map(
        arr.map(x => [key(x), x])
      ).values()
    ]
  }

  /**
   * @description
   *
   * Sort an array by string length Ex: a, aa, aaa, aaaa
   *
   * @param arr
   */
  static sortArrayByLength(arr) {
    arr.sort(function (a, b) {
      return a.length - b.length; //ASC, For Descending order use: b - a
    });
  }

  /**
   * @description
   *
   * Sort an array object by string length
   *
   * @param arr Ex: [{'prod': Surface pro 7}, {'prod': Surface book 2 64 GB}, {'prod': Surface} ]
   * @param key Ex: 'prod'
   * @returns [{'prod': Surface},{'prod': Surface pro 7}, {'prod': Surface book 2 64 GB}]
   */
  static sortArrayObjectByLength(arr, key) {
    let sortedArray = arr.sort(function (a, b) {
      return a[key].length - b[key].length;
    });
    return sortedArray;
  }

  /**
   * Sort an array object an by ascending of descending order
   *
   * @param key
   * @param order
   * @returns
   */
  static sortBY(key, order = 'asc') {
    return function innerSort(a, b) {

      if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
        // property doesn't exist on either object
        return 0;
      }

      const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
      const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return (
        (order === 'desc') ? (comparison * -1) : comparison
      );
    };
  }

  /**
   * @description
   *
   * Remove single occurance of an item from an array
   *
   * @param arr
   * @param value
   * @returns array
   */
  static removeItemOnce(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }

  /**
   * Remove all occurances including duplicate items from an array
   * @param arr
   * @param value
   * @returns
   */
  static removeItemAll(arr, value) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  }

  /**
   * Remove an object from any array by attribute. Ex:  removeByAttr(arr, 'id', 1);
   *
   * @param arr Ex: [{id:1, name:'one'}, {id:2, name:'two'},{id:3, name:'three'}]
   * @param attr Ex: 'id' or 'name'
   * @param value Ex: 1 or 'one'
   * @returns Array Ex: [{id:2, name:'two'},{id:3, name:'three'}]
   */
  static removeObjByAttr(arr, attr, value) {
    let i = arr.length;
    while (i--) {
      if (arr[i]
        && arr[i].hasOwnProperty(attr)
        && (arguments.length > 2 && arr[i][attr] === value)) {

        arr.splice(i, 1);

      }
    }
    return arr;
  }

  /**
   * Check if an item exist in an array. Ex: ifObjInArray(this.searchHistory, 'keyword', data)
   *
   * @param arr
   * @param key
   * @param str
   * @returns
   */
  static ifObjInArray(arr, key, str) {
    return arr.some(el => el[key] === str);
  }

  /**
   * CHeck if object value is empty
   * @param obj
   * @returns
   */
  static checkIfObjValuesEmpty(obj) {
    for (var key in obj) {
      if (obj[key] !== null && obj[key] != "")
        return false;
    }
    return true;
  }

  /**
   * Filters an array of objects with multiple match-criteria.
   *
   * @param array array: the array to filter
   * @param filters filters: an object with the filter criteria
   * @returns
   */
  static arrayObjectMultiFilter = (array: Object[], filters: Object) => {
    return array.filter((obj) => {
      return Object.entries(filters).every(([filterProperty, filterValues]) => {
        switch (Object.prototype.toString.call(obj[filterProperty])) {

          case '[object Object]':

            if (utilities.isObjectEmpty(filterValues)) {
              return true;
            }
            return Object.entries(filterValues).every(([extFilterProperty, extFilterValue]) => {
              return new Map(Object.entries(obj[filterProperty])).get(extFilterProperty) === extFilterValue;
            });

          case '[object Array]':
            if (!filterValues.length) {
              return true; // passing an empty filter means that filter is ignored.
            }
            return obj[filterProperty].some((productValue) => {
              return filterValues.includes(productValue);
            });

          case '[object String]':
            if (!filterValues.length) {
              return true; // passing an empty filter means that filter is ignored.
            }
            let str = obj[filterProperty];
            //console.log(filterValues)
            if (str.includes(",")) {
              var value = 0;
              let arr = str.split(',');
              arr.forEach(function (category) {
                value = value || filterValues.includes(category);
                //console.log(value)
                //return filterValues.includes(category);
              });
              // return (value === 1)
              return value;
            } else {
              return filterValues.includes(obj[filterProperty]);
            }

          case '[object Number]':
            if (!filterValues.length) {
              return true; // passing an empty filter means that filter is ignored.
            }
            if (filterValues == 0) { // this is custom based on passed value(number) so if condition
              return obj[filterProperty] <= 10 && obj['discountType'] == '%'
            } else if (filterValues < 100) {
              return obj[filterProperty] >= filterValues && obj['discountType'] == '%'
            } else {
              if (filterValues == 100) {
                return obj[filterProperty] <= 100 && obj['discountType'] == 'Rs'
              } else if (filterValues == 500) {
                return obj[filterProperty] >= 100 && obj[filterProperty] <= 500 && obj['discountType'] == 'Rs'
              } else if (filterValues == 1000) {
                return obj[filterProperty] >= 500 && obj[filterProperty] <= 1000 && obj['discountType'] == 'Rs'
              } else if (filterValues == 5000) {
                return obj[filterProperty] >= 1000 && obj[filterProperty] <= 5000 && obj['discountType'] == 'Rs'
              } else if (filterValues == 10000) {
                return obj[filterProperty] >= 5000 && obj[filterProperty] <= 10000 && obj['discountType'] == 'Rs'
              } else if (filterValues == 10001) {
                return obj[filterProperty] >= 10000 && obj['discountType'] == 'Rs'
              }
            }

          default:
            if (!filterValues.length) {
              return true; // passing an empty filter means that filter is ignored.
            }
            return filterValues.includes(obj[filterProperty]);
        }

      });
    });
  };

  /**
   * Check if device is IOS
   *
   * @returns True/False
   */
  static isIOS() {
    return [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod'
    ].includes(navigator.platform)
      // iPad on iOS 13 detection
      || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  }

  /**
   * Get the bank name from url and return. For new bank/corp add the condition here
   *
   * @returns Bank name
   */
  static getBankName() {
    let hostname = window.location.hostname;
    if (hostname.toLowerCase().includes('localhost')) {
      return 'PNB'
    } else if (hostname.toLowerCase().includes('canara')) {
      return 'CANARA';
    } else if (hostname.toLowerCase().includes('psbindia')) {
      return 'PSB';
    } else if (hostname.toLowerCase().includes('bob')) {
      let domain = window.location.hostname;//(new URL(url));
      domain = hostname.replace('www.', '');
      console.log(domain);
      const myArray = domain.split(".");
      console.log(myArray[0].toLowerCase());
      if (myArray[0].toLowerCase() == 'bobcardrewards-sg') {
        return 'BFSL';
      } else if (myArray[0].toLowerCase() == 'bobcardrewards') {
        return 'BFSL';
      }else {
        return 'BOB';
      }
    } else if (hostname.toLowerCase().includes('bom')) {
      return 'BOM';
    } else if (hostname.toLowerCase().includes('pnb')) {
      return 'PNB';
    } else if (hostname.toLowerCase().includes('ib')) {
      return 'IB';
    } else if (hostname.toLowerCase().includes('csb')) {
      return 'CSB';
    }else if (hostname.toLowerCase().includes('bandhan')) {
      return 'BANDHAN';
    //}else if (hostname.toLowerCase().includes('bobcardrewards')) {
    //  return 'BFSL';
    } else if (hostname.toLowerCase().includes('mresult')) {
      return 'MRESULT';
    } else if (hostname.toLowerCase().includes('posist')) {
      return 'POSIST';
    } else if (hostname.toLowerCase().includes('prokids')) {
      return 'PROKIDS';
    } else if (hostname.toLowerCase().includes('pristyncare')) {
      return 'PRISTYNCARE';
    } else if (hostname.toLowerCase().includes('shop')) {
      return 'CHEGGOUT';
    } else if (hostname.toLowerCase().includes('kantabuy')) {
      return 'CHEGGOUT';
    } else if (hostname.toLowerCase().includes('rewards')) {
      return 'CHEGGOUT';
    } else {
      return 'CHEGGOUT'
    }
  }

  /**
   * Get Bank/corp full name
   *
   * @returns String full bank name
   */
  static getBankFullName() {
    let bankName = this.getBankName();
    if (bankName == 'CANARA') {
      return 'Canara Bank';
    } else if (bankName == 'PSB') {
      return 'Punjab & Sind Bank';
    } else if (bankName == 'BOB') {
      return 'Bank of Baroda';
    } else if (bankName == 'BOM') {
      return 'Bank of Maharashtra';
    } else if (bankName == 'PNB') {
      return 'Punjab National Bank';
    } else if (bankName == 'IB') {
      return 'Indian Bank';
    } else if (bankName == 'CSB') {
      return 'CSB Bank';
    } else if (bankName == 'MRESULT') {
      return 'MResult';
    } else if (bankName == 'POSIST') {
      return 'Posist';
    } else if (bankName == 'PROKIDS') {
      return 'ProKids';
    } else if (bankName == 'PRISTYNCARE') {
      return 'Pristyn Care';
    } else if (bankName == 'CHEGGOUT') {
      return 'Cheggout';
    } else if (bankName == 'BANDHAN') {
      return 'Bandhan Bank';
    }else if (bankName == 'BFSL') {
      return 'BOB Financial';
    }  else {
      return 'Cheggout'
    }
  }

  /**
   * Get favicon url by bank name
   *
   * @returns url: string
   */
  static getFavicon() {
    let bankName = this.getBankName();
    if (bankName == 'CANARA') {
      return '../assets/images/canaraicon.ico';
    } else if (bankName == 'PSB') {
      return '../assets/images/psbicon.ico';
    } else if (bankName == 'BOB') {
      return '../assets/images/bobicon.ico';
    } else if (bankName == 'BOM') {
      return '../assets/images/bomicon.ico';
    } else if (bankName == 'PNB') {
      return '../assets/images/pnbicon.ico';
    } else if (bankName == 'IB') {
      return '../assets/images/ibicon.ico';
    } else if (bankName == 'CSB') {
      return '../assets/images/csbicon.ico';
    } else if (bankName == 'MRESULT') {
      return '../assets/images/mresult.ico';
    } else if (bankName == 'POSIST') {
      return '../assets/images/posist.ico';
    } else if (bankName == 'PROKIDS') {
      return '../assets/images/prokids.ico';
    } else if (bankName == 'PRISTYNCARE') {
      return '../assets/images/pristyncare.ico';
    } else if (bankName == 'CHEGGOUT') {
      return '/favicon.ico';
    } else if(bankName == 'BANDHAN') {
    return '../assets/images/bandhanicon.png';
    }else if(bankName == 'BFSL') {
      return '../assets/images/bfslicon.ico';
      } else {
      return '/favicon.ico'
    }
  }

  /**
   * Get theme color by bank name
   *
   * @returns color hex code: string
   */
  static getThemeColor() {
    let bankName = this.getBankName();
    if (bankName == 'CANARA') {
      return '#2196f3';
    } else if (bankName == 'PSB') {
      return '#007c3d';
    } else if (bankName == 'BOB') {
      return '#ff6633';
    } else if (bankName == 'BOM') {
      return '#0089cf';
    } else if (bankName == 'PNB') {
      return '#a20a3a';
    } else if (bankName == 'IB') {
      return '#034ea1';
    } else if (bankName == 'CSB') {
      return '#ff6600';
    } else if (bankName == 'MRESULT') {
      return '#f89738';
    } else if (bankName == 'POSIST') {
      return '#006db8';
    } else if (bankName == 'PRISTYNCARE') {
      return '#7C5295';
    } else if (bankName == 'PROKIDS') {
      return '#7C5295';
    } else if (bankName == 'CHEGGOUT') {
      return '#ff8300';
    } else if (bankName == 'BANDHAN') {
      return '#004880';
    } else {
      return '#ff715b'
    }
  }

  /**
   * Get Google tracking ID by bank name
   *
   * @returns tracking id: string
   */
  static getGATrackingID() {
    let hostname = window.location.hostname;
    if (hostname.toLowerCase().includes('dev') || hostname.toLowerCase().includes('stage')) {
      return undefined;
    } else if (hostname.toLowerCase().includes('localhost')) {
      return undefined
    } else {
      let bankName = this.getBankName();
      if (bankName == 'CANARA') {
        return 'UA-85495018-15';
      } else if (bankName == 'PSB') {
        return 'UA-85495018-8';
      } else if (bankName == 'BOM') {
        return 'UA-85495018-5';
      } else if (bankName == 'IB') {
        return 'UA-85495018-14';
      } else if (bankName == 'BOB') {
        return 'UA-85495018-9';
      } else if (bankName == 'CSB') {
        return 'UA-85495018-10';
      } else if (bankName == 'MRESULT') {
        return 'UA-85495018-13';
      } else if (bankName == 'CHEGGOUT') {
        return 'UA-85495018-12'
      }else if (bankName == 'BANDHAN') {
        return 'UA-85495018-16'
      }
       else {
        return undefined;
      }
    }
  }

  /**
   * @ignore
   */
  static getMPToken() {  //MixPanel Token
    let hostname = window.location.hostname;
    if (hostname.toLowerCase().includes('dev') || hostname.toLowerCase().includes('stage')) {
      return '3aeadbfb44ec2c9345ebe700dc211408';
    } else if (hostname.toLowerCase().includes('localhost')) {
      return 'f1c9f829e52cd3778fde35c24999db58'
    } else {
      let bankName = this.getBankName();
      if (bankName == 'CANARA') {
        return 'ec6d3ebb4f83c54dca74e15fe791e5e8';
      } else if (bankName == 'PSB') {
        return 'b3e0d9f7c8ef6bde120a790ca19daf45';
      } else if (bankName == 'BOM') {
        return 'a9926901c5e5bf6b06fa8cd7a7fec705';
      } else if (bankName == 'BOB') {
        return '981ca96791b67cb473e646b0b0fde2f1';
      } else if (bankName == 'CSB') {
        return 'f69c35a2e7caf3aab6d6ef51c6ad229e';
      } else {
        return '3aeadbfb44ec2c9345ebe700dc211408';
      }
    }
  }

  /**
   * @ignore
   */
  static getRazorPayKey() {  //rzp_test_QgrlEUXuNPw2LO // 'rzp_live_E1WAg4zm2etpuS' //rzp_test_partner_E8NJ4cxIswkRhe
    let hostname = window.location.hostname;
    if (hostname.toLowerCase().includes('dev') || hostname.toLowerCase().includes('stage')) {
      return 'rzp_test_QgrlEUXuNPw2LO';
    } else if (hostname.toLowerCase().includes('localhost')) {
      return 'rzp_test_QgrlEUXuNPw2LO';
    } else {
      return "rzp_live_E1WAg4zm2etpuS";
    }
  }

  /**
   * Check if bank/corp registration required/can be skipped/cant be skipped
   *
   * 0 - Registration Not Required
   *
   * 1 - Registration Required but can be skipped
   *
   * 2 - Registration Required Can not be skipped
   *
   * We set isRegistration value in local storage from API response like GetUnserInfo
   *
   * @returns True/False
   */
  static isAccountTypeA() {
    let registerType = this.getIsRegistration();
    if (registerType) {
      return true;
    } else {
      return false;
    }
    // let bankName = this.getBankName();
    // if (bankName == 'IB' || bankName == 'BOM' || bankName == 'CHEGGOUT' || bankName == 'MRESULT' || bankName == 'POSIST' || bankName == 'PROKIDS' || bankName == 'PRISTYNCARE') {
    //   return true;
    // } else {
    //   return false;
    // }
  }

  static isCallingBankAPI() {
    let bankName = this.getBankName();
    if (bankName == 'IB' || bankName == 'BOMs'|| bankName == 'CANARA' || bankName == 'PNB') {
      return true;
    } else {
      return false;
    }
  }
  static isCanara() {
    let bankName = this.getBankName();
    if (bankName == 'CANARA') {
      return true;
    } else {
      return false;
    }
  }

  static isPNB() {
    let bankName = this.getBankName();
    if (bankName == 'PNB') {
      return true;
    } else {
      return false;
    }
  }

  static isProfileEnabled() {
    let bankName = this.getBankName();
    if (bankName == 'IB') {
      return true;
    } else {
      return false;
    }
  }

  static createUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  static createBankID() {
    return 'CHEGxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  static detectBrowser = (function () {
    let test = function (regexpOrCss) {
      return regexpOrCss instanceof RegExp ?
        regexpOrCss.test(window.navigator.userAgent) :
        window.CSS && window.CSS.supports && window.CSS.supports(regexpOrCss);
    };
    switch (true) {
      case test(/edg/i): return "edge";
      case test(/trident/i): return "ie";
      case test(/opr/i) && (!!window.opr || !!window.opera): return "opera";
      case test('(-webkit-touch-callout: none)'): return "ios safari";
      case test(/chrome/i) && !!window.chrom: return "chrome";
      case test(/firefox/i): return "firefox";
      case test(/safari/i): return "macos safari";
      default: return "other";
    }
  })();

  static getFingerPrint() {
    let fingerprint = (function (window, screen, navigator) {

      function checksum(str) {
        let hash = 5381,
          i = str.length;
        while (i--) hash = (hash * 33) ^ str.charCodeAt(i);
        return hash >>> 0;
      }

      function map(arr, fn) {
        let i = 0, len = arr.length, ret = [];
        while (i < len) {
          ret[i] = fn(arr[i++]);
        }
        return ret;
      }

      return checksum([
        navigator.userAgent,
        [screen.height, screen.width, screen.colorDepth].join('x'),
        new Date().getTimezoneOffset(),
        !!sessionStorage,
        !!localStorage,
        map(navigator.plugins, function (plugin) {
          return [
            plugin.name,
            plugin.description,
            map(plugin, function (mime) {
              return [mime.type, mime.suffixes].join('~');
            }).join(',')
          ].join("::");
        }).join(';')
      ].join('###'));

    }(this, screen, navigator));
    return fingerprint;
  }

  static getChegUID() {
    // // Let us open our database
    // var DBOpenRequest = window.indexedDB.open("dbCheggout", 1);

    // DBOpenRequest.onupgradeneeded = function () {
    //     // Create a new object store if this is the first time we're using
    //     // this DB_NAME/DB_VERSION combo.
    //     DBOpenRequest.result.createObjectStore('user', { autoIncrement: true });
    // };

    // DBOpenRequest.onsuccess = function (event) {
    //     //console.log(DBOpenRequest.result)

    //     // store the result of opening the database in db.
    //     let db = DBOpenRequest.result;
    //     console.log(db)

    //     // const items = db.transaction('user').objectStore('user').getAll()
    //     // console.log(items.target.result)

    //     var transaction = db.transaction('user', 'readonly');
    //     var objectStore = transaction.objectStore('user');
    //     objectStore.getAll().onsuccess = function (event) {

    //         let database = (event.target as IDBOpenDBRequest).result;
    //         console.log(database[0].chegUId);
    //     };
    // };
    let chegUID
    try {
      chegUID = JSON.parse(localStorage.getItem('chegUID'));
    } catch (e) {
      localStorage.removeItem('chegUID');
      chegUID = 0;
    }
    return chegUID;
  }

  static getMobNumber() {
    let mobNumber
    try {
      mobNumber = JSON.parse(localStorage.getItem('mobileNumber'));
    } catch (e) {
      localStorage.removeItem('mobileNumber');
      mobNumber = 0;
    }
    return mobNumber;
  }

  static getName() {
    let name
    try {
      name = JSON.parse(localStorage.getItem('userName'));
    } catch (e) {
      localStorage.removeItem('userName');
      name = 0;
    }
    return name;
  }

  static getEmail() {
    let email
    try {
      email = JSON.parse(localStorage.getItem('emailID'));
    } catch (e) {
      localStorage.removeItem('emailID');
      email = 0;
    }
    return email;
  }

  static getDomain() {
    let domain
    try {
      domain = JSON.parse(localStorage.getItem('domain'));
    } catch (e) {
      localStorage.removeItem('domain');
      domain = null;
    }
    return domain;
  }

  static getBankVIDURL() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const newParams = new URLSearchParams();

    urlParams.forEach(function (value, name) {
      newParams.append(name.toLowerCase(), decodeURIComponent(value));
    });
    if (this.isCanara() || this.isPNB()){
      var BankUID = newParams.get('virtualid');
      if(BankUID!= null && BankUID!= 'null'){
        localStorage.setItem('encdata',BankUID);
      }
      else if((localStorage.getItem('encdata')!=null) && (localStorage.getItem('encdata')!='null')){
        BankUID = localStorage.getItem('encdata');
      }
      var sessionID = newParams.get('sessionid');
      if(sessionID!= null && sessionID!= 'null'){
        localStorage.setItem('sessionID',sessionID);
      }
    }else{
      var BankUID = newParams.get('encdata');
      if(BankUID!= null && BankUID!= 'null'){
        localStorage.setItem('encdata',BankUID);
      }
      else if((localStorage.getItem('encdata')!=null) && (localStorage.getItem('encdata')!='null')){
        BankUID = localStorage.getItem('encdata');
      }
    }
   
    return BankUID; 
  }

  static getBankID() {
    let bankUID
    try {
      bankUID = (this.isCanara() || this.isPNB()) ? localStorage.getItem('bankUID') : JSON.parse(localStorage.getItem('bankUID'));
      if (!bankUID || bankUID == '0' || bankUID == 0) {
        if (this.isCallingBankAPI() || ((this.isCanara() || this.isPNB()) && this.checkVirtualIdSessionId())) {
          let guestBankUID = this.getBankVIDURL();
          if (guestBankUID) {
            localStorage.setItem('bankUID', (this.isCanara() || this.isPNB()) ? guestBankUID: JSON.stringify(encodeURIComponent(guestBankUID)));
            bankUID = (this.isCanara() || this.isPNB()) ? localStorage.getItem('bankUID') :JSON.parse(localStorage.getItem('bankUID'));
          }
          if (!bankUID || bankUID == '0' || bankUID == 0) {
            bankUID = this.createBankID();
            localStorage.setItem('bankUID', JSON.stringify(bankUID));
          }
        }       
      } else {
        let guestBankUID = this.getBankVIDURL();
        if (guestBankUID) {
          localStorage.setItem('bankUID', this.isCanara()? guestBankUID : JSON.stringify(encodeURIComponent(guestBankUID)));
          bankUID = this.isCanara()? localStorage.getItem('bankUID') :JSON.parse(localStorage.getItem('bankUID'));
        }
      }
    } catch (e) {
      localStorage.removeItem('bankUID');
      bankUID = 0;
    }
    //console.log(bankUID)
    return bankUID;
  }

  static getIsRegistration() {
    let isRegistration
    try {
      isRegistration = JSON.parse(localStorage.getItem('isRegistration'));
    } catch (e) {
      localStorage.removeItem('isRegistration');
      isRegistration = 0;
    }
    return isRegistration;
  }

  static getIsReward() {
    let isReward
    try {
      isReward = JSON.parse(localStorage.getItem('isReward'));
    } catch (e) {
      localStorage.removeItem('isReward');
      isReward = 0;
    }
    return isReward;
  }

  static getType() {
    let type
    try {
      type = JSON.parse(localStorage.getItem('type'));
    } catch (e) {
      localStorage.removeItem('type');
      type = 'Bank';
    }
    return type;
  }

  static getImpressionDetails() {
    let impression;
    try {
      impression = JSON.parse(localStorage.getItem('impressionEvents'));
    } catch (e) {
      localStorage.removeItem('impressionEvents');
      impression = [];
    }
    return impression;
  }
  
  static saveImpressionDetails(impressionData) {
    //console.log(type, data);
    let savedEvents = JSON.parse(localStorage.getItem('impressionEvents')) ?? [];
    const todayDate = new Date();
    savedEvents.push({
      type:impressionData.type,
      page_name:impressionData.page_name,
      id: impressionData.id,
      idType:impressionData.idType,
      eventType: impressionData.eventType,
      page: impressionData.page,
      section: impressionData.section,
      merchantID: impressionData.merchantID,
      merchantName: impressionData.merchantName,
      adID: impressionData.adID,
      adTitle: impressionData.adTitle,
      adType: impressionData.adType,
      categoryID: impressionData.categoryID,
      categoryName: impressionData.categoryName,
      offerID: impressionData.offerID,
      offerName: impressionData.offerName,
      giftID: impressionData.giftID,
      giftName: impressionData.giftName,
      productID:impressionData.productID,
      productName:impressionData.productName,
      name:impressionData.name,
      source:impressionData.source,
      timeInterval: todayDate.toLocaleString()
    })
  //  console.table(savedEvents);
    localStorage.setItem('impressionEvents', JSON.stringify(savedEvents));
  }

  static geHRRoleID() {
    return 1;
  }

  static getUrlExtension(url) {
    return url.split(/[#?]/)[0].split('.').pop().trim();
  }

  static addBodyClass(classlist: any) {
    body.classList.add(...classlist);
  }

  static addHTMLClass(classlist: any) {
    html.classList.add(...classlist);
  }

  static removeBodyClass(classlist: any) {
    body.classList.remove(...classlist);
  }

  static removeHTMLClass(classlist: any) {
    html.classList.remove(...classlist);
  }

  static detectDevice() {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
      return 'Mobile';
    } else {
      return 'Desktop';
    }
  }

  static generateProductInfoObject(data, pageName, wind, isMobile?) { //  wind is a new window for Safari and other old browser since it block opening new window  
    let uuid = this.createUUID();
    let url = data.href || data.siteUrl || data.promoLink || data.bannerUrl;
    if (url.indexOf('uuid') > -1) {
      url = url.toString().replace("uuid", uuid);
    }
    if (url.indexOf('bankid') > -1) {
      url = url.toString().replace("bankid", this.getBankName());
    }
    let newWindow;
    if(this.getBankName() === 'PNB' && isMobile) {
      newWindow = window.open('', '_self');
    } else {
      newWindow = window.open('', '_blank');
    }
    if (newWindow) {
      newWindow.document.write('Loading preview...');
      newWindow.location.href = url;
    } else {
      if (wind) {
        wind.document.write('Loading preview...');
        wind.location.href = url;
      }
    }
    const model = {
      AdvertiserName: data.siteName || data.storeName || data.marchantName || data.merchantName,
      StoreId: data.siteID || data.storeId || data.siteId,
      CategoryName: data.category || "",
      ProductName: data.productName || "",
      ProductURL: url,
      Price: data.price || 0,
      ASINNumber: data.productNumber || "",
      SearchedKeyword: data.productName || "",
      BankName: this.getBankName(),
      DeviceType: "WEB",
      DeviceBrowser: this.detectBrowser,
      OfferID: 0,
      OfferName: "",
      TripID: uuid,
      SessionID: "",
      PreLoginId: this.getBankID(),
      ChegCustomerId: this.getChegUID(),
      PageName: pageName
    }
    return model;
  }

  static getSessionId() {
    let sessionid
    try {
      sessionid = localStorage.getItem('sessionID');
    } catch (e) {
      localStorage.removeItem('sessionID');
      sessionid = '';
    }
    return sessionid;
  }
  static checkvirtualIdDiff(){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const newParams = new URLSearchParams();

    urlParams.forEach(function (value, name) {
      newParams.append(name.toLowerCase(), decodeURIComponent(value));
    });
    var BankUID = newParams.get('virtualid');
    var storedBankId =  localStorage.getItem('encdata');
    if(BankUID != storedBankId){
      return true;
    }else{
      return false;
    }
  }

  static checkVirtualIdSessionId() {
    let present = false;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const newParams = new URLSearchParams();

    urlParams.forEach(function (value, name) {
      newParams.append(name.toLowerCase(), decodeURIComponent(value));
    });
    var BankUID = newParams.get('virtualid');
    var sessionID = newParams.get('sessionid');
    if (sessionID != null && sessionID != 'null' && BankUID != null && BankUID != 'null') {
      present = true;
    }
    return present;
  }

  static checksessionIdDiff() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const newParams = new URLSearchParams();

    urlParams.forEach(function (value, name) {
      newParams.append(name.toLowerCase(), decodeURIComponent(value));
    });
    var sessionId = newParams.get('sessionid');
    var storedSessionId = localStorage.getItem('sessionID');
    if (sessionId != storedSessionId) {
      return true;
    } else {
      return false;
    }
  }
  static checkIsValid() {
    let isValid
    try {
      isValid = localStorage.getItem('isValid');
    } catch (e) {
      localStorage.removeItem('isValid');
      isValid = '';
    }
    return isValid;
  }
  static checkIsRegistetred() {
    let isRegistered
    try {
      isRegistered = localStorage.getItem('isRegistered');
    } catch (e) {
      localStorage.removeItem('isRegistered');
      isRegistered = '';
    }
    return isRegistered;
  }

}

