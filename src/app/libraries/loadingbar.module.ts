import { NgModule } from '@angular/core';
// for HttpClient import:
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';

// for Router import:
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

// for Core import:
import { LoadingBarModule } from '@ngx-loading-bar/core';

@NgModule({
    imports: [
        LoadingBarHttpClientModule,
        LoadingBarRouterModule,
        LoadingBarModule
    ],
    exports: [
        LoadingBarHttpClientModule,
        LoadingBarRouterModule,
        LoadingBarModule
    ]
})

export class LoadingbarModule { }