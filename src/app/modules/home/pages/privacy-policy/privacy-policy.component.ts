import { Component, OnInit, OnDestroy } from '@angular/core';
import { FooterService } from '@app/core/services/footer.service';
import { TitleService } from '@app/core/services/title.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { utilities } from '@utilities/utilities';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit,OnDestroy {
  policyData = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  bank = utilities.getBankName();
  constructor(private titleService:TitleService,private footerService: FooterService) { }

  
  ngOnInit(): void {
    this.titleService.setTitle("Privacy Policy");
    this.titleService.updateDescription(this.bank+" privacy policy ")
    this.getFooterData();
  }
  public getFooterData() {
    this.footerService.getfooterdeatils()
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res) {
          this.policyData = res;
        } else {
          this.policyData = [];
        }
      }, err => {
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
