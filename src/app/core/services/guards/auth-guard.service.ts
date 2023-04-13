import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { DialogService } from '@core/services/dialog.service';
import { utilities } from '@utilities/utilities';
@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {  // this Guard is not used anymore

  return: string = '';
  constructor(
    private router: Router,
    private authService: AuthService,
    private dialogService: DialogService,
  ) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.return = state.url;
    //Bypassing CANARA & PNB, since it allows soft login
    if (this.authService.isLoggedIn() || utilities.isCanara() || utilities.isPNB()) {
      return true
    } else {
      this.loginDialog();
      return false;
    }
  }

  public loginDialog() {
    utilities.addHTMLClass(['login_page']);

    const options = {
      title: 'Login',
      message: 'Login',
      cancelText: 'Cancel',
      confirmText: 'Confirm'
    };
    this.dialogService.openLogin(options);
    this.dialogService.loginConfirmed().subscribe(confirmed => {
      if (confirmed) {
        //do something if confirmed is true
        this.router.navigateByUrl(this.return);
      }
      utilities.removeHTMLClass(['login_page']);
    });

  }
}
