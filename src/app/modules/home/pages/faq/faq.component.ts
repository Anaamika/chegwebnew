import { Component, OnInit, OnDestroy } from '@angular/core';
import { FooterService } from '@app/core/services/footer.service';
import { TitleService } from '@app/core/services/title.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { utilities } from '@utilities/utilities';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit, OnDestroy {
  faqData = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  bank = utilities.getBankName();
  constructor(private titleService:TitleService,private footerService: FooterService) { }

  ngOnInit(): void {
    this.titleService.setTitle("Frequently asked questions");
    this.titleService.updateDescription("Explore more about "+this.bank+"! Answers to all your questions ")
    this.getFooterData();
  }
  public getFooterData() {
    this.footerService.getfooterdeatils()
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res) {
          this.faqData = res;
        } else {
          this.faqData = [];
        }
      }, err => {
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
