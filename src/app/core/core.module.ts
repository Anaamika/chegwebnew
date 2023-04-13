import { NgModule, SkipSelf, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import * as fromLayout from './layouts';
import * as fromComponent from './layouts/components';
import * as fromInterceptor from './interceptors';
import * as fromPipe from './pipe';
import { MaterialModule } from '@libraries/material.module';
import { MatIconModule } from '@angular/material/icon';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientJsonpModule } from '@angular/common/http';

import { NgxIndexedDBModule, DBConfig } from 'ngx-indexed-db';

import { LottieModule } from 'ngx-lottie';

import { RecaptchaModule } from 'ng-recaptcha';  //RecaptchaFormsModule

// export interface FormModel {
//   captcha?: string;
// }
// Ahead of time compiles requires an exported function for factories
export function migrationFactory() {
  // The animal table was added with version 2 but none of the existing tables or data needed
  // to be modified so a migrator for that version is not included.
  return {
    2: (db: any, transaction: { objectStore: (arg0: string) => any; }) => {
      const store = transaction.objectStore("User");
      store.createIndex('isActive', 'isActive', { unique: false });
    }
  };
}

// Note we need a separate function as it's required
// by the AOT compiler.
export function playerFactory() {
  return import(/* webpackChunkName: 'lottie-web' */ 'lottie-web');
}

// let dbConfig: DBConfig = {
//   name: 'dbCheggout',
//   version: 1.1,
//   objectStoresMeta: [{
//     store: 'user',
//     storeConfig: { keyPath: 'chegUId', autoIncrement: false },
//     storeSchema: [
//       { name: 'chegUId', keypath: 'chegUId', options: { unique: true } },
//       { name: 'bankUId', keypath: 'bankUId', options: { unique: false } },
//       { name: 'phoneNumber', keypath: 'phoneNumber', options: { unique: false } },
//       { name: 'bankName', keypath: 'bankName', options: { unique: false } },
//       { name: 'userName', keypath: 'userName', options: { unique: false } },
//       { name: 'emailID', keypath: 'emailID', options: { unique: false } },
//       { name: 'rewardBalance', keypath: 'rewardBalance', options: { unique: false } },
//       { name: 'isRegistration', keypath: 'isRegistration', options: { unique: false } },
//       { name: 'isReward', keypath: 'isReward', options: { unique: false } },
//       { name: 'isRegistered', keypath: 'isRegistered', options: { unique: false } },
//       { name: 'accessToken', keypath: 'accessToken', options: { unique: false } },
//       { name: 'refreshToken', keypath: 'refreshToken', options: { unique: false } },
//       { name: 'expireDate', keypath: 'expireDate', options: { unique: false } },
//     ]
//   },
//   {
//     store: 'categories',
//     storeConfig: { keyPath: 'id', autoIncrement: false },
//     storeSchema: [
//     ]
//   },
//   {
//     store: 'stores',
//     storeConfig: { keyPath: 'siteID', autoIncrement: false },
//     storeSchema: [
//     ]
//   }],
//   //migrationFactory
// };
@NgModule({
  declarations: [...fromPipe.pipes, ...fromLayout.layouts, ...fromComponent.components],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientJsonpModule,
    //NgxIndexedDBModule.forRoot(dbConfig),

    LottieModule.forRoot({ player: playerFactory, useCache: true }),
    // LottieModule.forRoot({ player: playerFactory }),

    RecaptchaModule,  //this is the recaptcha main module
    //RecaptchaFormsModule, //this is the module for form incase form validation
  ],
  exports: [...fromPipe.pipes, ...fromLayout.layouts, MaterialModule, MatIconModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: fromInterceptor.HttpErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: fromInterceptor.CacheInterceptor,
      multi: true
    },
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() core: CoreModule) {
    if (core) {
      throw new Error("You should import core module only in the root module")
    }
  }
}
