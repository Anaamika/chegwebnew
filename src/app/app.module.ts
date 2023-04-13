import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';

import { CoreModule } from '@core/core.module';
import { LoadingbarModule } from '@libraries/loadingbar.module';

import { StartupService } from '@core/services/startup.service';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

export function startupServiceFactory(startupService: StartupService): Function {
  return () => startupService.load();
}

/**
 * Implementation of APP_INITIALIZER
 *
 * @description
 *
 * Calling startup service to get JWT Token, ChegUserID and other configuration data before application load
 *
 * @param startupService
 * @returns startupService load promise
 */
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    LoadingbarModule,
    NgIdleKeepaliveModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    Title,
    StartupService,
    {
      // Provider for APP_INITIALIZER
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [StartupService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
