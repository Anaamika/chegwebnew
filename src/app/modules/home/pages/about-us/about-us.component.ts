import { Component, OnInit, OnDestroy } from '@angular/core';
import { FooterService } from '@app/core/services/footer.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TitleService } from '@app/core/services/title.service';
import { utilities } from '@utilities/utilities';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit, OnDestroy {
  aboutData = [];
  destroy$: Subject<boolean> = new Subject<boolean>();
  bank = utilities.getBankName();
  constructor(private footerService: FooterService,private titleService: TitleService,private router: Router) { }

  ngOnInit(): void {
    this.getFooterData();
    this.titleService.setTitle("Shop, save and earn cashback");
    this.titleService.updateDescription("Shop more, save more with "+this.bank+". Order from your favourite online store via "+this.bank+", save and earn cashbacks.");
    if(this.bank == "BANDHAN" && this.router.url == "/about-us"){
      document.body.style.backgroundColor = '#fff';
      //document.body.classList.add('about-bg');
    }
  }
  
  public getFooterData() {
    this.footerService.getfooterdeatils()
      .pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res) {
          this.aboutData = res;
        } else {
          this.aboutData = [];
        }
      }, err => {
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    document.body.style.backgroundColor = '#eaebef';
    //document.body.classList.remove('about-bg');
  }
}
