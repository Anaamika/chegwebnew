import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { DialogService } from '@core/services/dialog.service';
import { utilities } from '@utilities/utilities';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  return: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private dialogService: DialogService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    this.return = state.url;
    const expectedRole = +route.data.expectedRole;

    if (this.authService.isLoggedIn()) {
      if (this.authService.isHR(expectedRole)) {
        return true;
      } else {
        this.router.navigate(['/']);
        return false;
      }
    } else {
      this.loginDialog();
      return false;
    }

    // // this will be passed from the route config
    // // on the data property
    // const expectedRole = route.data.expectedRole;
    // const token = localStorage.getItem('token');
    // // decode the token to get its payload
    // // const tokenPayload = decode(token);
    // if (!this.auth.isAuthenticated() || tokenPayload.role !== expectedRole) {
    //   this.router.navigate(['login']);
    //   return false;
    // }
    // return true;
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
