import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { utilities } from '@utilities/utilities';

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  constructor(public dynamicTitle:Title, public meta: Meta) { }

  bank = utilities.getBankName();
  setTitle(title){
    if(title){
      this.dynamicTitle.setTitle(this.bank+": "+title);
    }
    else{
      this.dynamicTitle.setTitle(this.bank+": "+"Compare prices, get best deals, cashback offers and coupons");
    }
  }

  updateDescription(desc: string) {
    this.meta.updateTag({ name: 'description', content: desc })
  }
}
