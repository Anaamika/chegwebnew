import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { RecaptchaComponent } from 'ng-recaptcha';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

  RecaptchaComponent.prototype.ngOnDestroy = function() {  //To fix “zone.js: Unhandled Promise rejection” issue when route changes
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
}
