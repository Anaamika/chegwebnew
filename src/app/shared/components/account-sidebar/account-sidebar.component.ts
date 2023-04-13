import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { utilities } from '@utilities/utilities';
import { AuthService } from '@core/services/auth.service';
@Component({
  selector: 'app-account-sidebar',
  templateUrl: './account-sidebar.component.html',
  styleUrls: ['./account-sidebar.component.scss']
})
export class AccountSidebarComponent implements OnInit {
  isHR: boolean = false;
  type = utilities.getType();
  bankName= utilities.getBankName();
  ifProfile = utilities.isProfileEnabled();
  
  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.isHR = this.authService.isHR(utilities.geHRRoleID())
  }
}
