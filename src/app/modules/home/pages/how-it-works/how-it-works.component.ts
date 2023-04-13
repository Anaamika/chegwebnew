import { Component, OnInit } from '@angular/core';
import { TitleService } from '@app/core/services/title.service';
import { utilities } from '@utilities/utilities';

@Component({
  selector: 'app-how-it-works',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss']
})
export class HowItWorksComponent implements OnInit {
  bank = utilities.getBankName();
  constructor(private titleService:TitleService) { }

  ngOnInit(): void {
    this.titleService.setTitle("Compare prices, get best deals, cashback offers and coupons");
    this.titleService.updateDescription("Compare, shop, save and earn with "+this.bank);
  }

}
