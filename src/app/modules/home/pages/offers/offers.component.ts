import { Component, OnInit } from '@angular/core';
import { utilities } from '@utilities/utilities';
import { TitleService } from '@app/core/services/title.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {

  bank = utilities.getBankName();
  constructor(private titleService:TitleService) { }

  ngOnInit(): void {
    this.titleService.setTitle("Best deals and offers in India. Save up to 50%, earn cashbacks ");
    this.titleService.updateDescription("Offers too good to miss! Shop via " + this.bank + ", save with coupons and offers, earn cashback.")
  }

}
