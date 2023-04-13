import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { FooterService } from '@app/core/services/footer.service';
import { takeUntil } from 'rxjs/operators';
import { TitleService } from '@app/core/services/title.service';
import { utilities } from '@utilities/utilities';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss']
})
export class TermsAndConditionsComponent implements OnInit,OnDestroy {
  termsData = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  bank = utilities.getBankName();
  constructor(private titleService:TitleService,private footerService: FooterService) { }

  ngOnInit(): void {
    this.titleService.setTitle("Terms and Conditions");
    this.titleService.updateDescription(this.bank+": Terms and Conditions ")
    this.getFooterData();
  }
  public getFooterData() {
    this.footerService.getfooterdeatils()
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res) {
          this.termsData = res;
        } else {
          this.termsData = [];
        }
      }, err => {
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
