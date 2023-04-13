import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { utilities } from '@app/utilities/utilities';

@Component({
  selector: 'app-gift-card-amount',
  templateUrl: './gift-card-amount.component.html',
  styleUrls: ['./gift-card-amount.component.scss']
})
export class GiftCardAmountComponent implements OnInit {

  @Input() giftCardAmountData;
  @Output() amountEvent = new EventEmitter<object>();
  giftCardDenominations: number[] = [];
  giftCardMinPrice: number = 1;
  giftCardMaxPrice: number;
  isSlab: boolean = false;
  giftCardOfferValue: number;

  giftCardAmount = new FormControl(0);
  giftCardCustomAmount = new FormControl('Other');
  giftCardDiscount: number = 0;
  amountAfterDiscount: number = 0;
  @ViewChild('otherAmount') otherAmount: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (!utilities.isObjectEmpty(this.giftCardAmountData)) {

      this.giftCardMinPrice = +this.giftCardAmountData['giftCardMinPrice']
      this.giftCardMaxPrice = +this.giftCardAmountData['giftCardMaxPrice']
      this.giftCardCustomAmount.setValidators([Validators.min(this.giftCardMinPrice), Validators.max(this.giftCardMaxPrice)]);
      if (this.giftCardAmountData['priceType'] == 'SLAB') {
        this.isSlab = true;
      }
      this.giftCardOfferValue = this.giftCardAmountData['giftCardOfferValue']

      let denominations = this.giftCardAmountData['giftCardDenominations'];
      if (denominations) {
        this.giftCardDenominations = denominations.split(',').map(x => +x);
        this.giftCardAmount.setValue(this.giftCardDenominations[this.giftCardDenominations.length - 1])
      } else {
        this.giftCardDenominations.push(this.giftCardMinPrice);
        this.giftCardDenominations.push(this.giftCardMaxPrice);
        this.giftCardAmount.setValue(this.giftCardMaxPrice)
      }

      setTimeout(() => {
        this.calculateDiscount();
      }, 0);
    }

  }

  giftCardAmountClick() {
    if (!this.isSlab) {
      this.otherAmount.nativeElement.classList.remove('active');
      this.otherAmount.nativeElement.classList.remove('blur');
      this.giftCardCustomAmount.setValue('Other');
    }

    setTimeout(() => {
      this.calculateDiscount();
      // this.payableAmount = this.amountAfterDiscount;
      // this.eWalletMethod.setValue('');
      // this.fromWalletBalance = 0;
    }, 0);
  }

  customAmountClick($event) {
    this.giftCardAmount.setValue(0)
    $event.srcElement.classList.add("blur");
    this.giftCardCustomAmount.setValue('')
    if ($event.srcElement.querySelector('input') != null) {
      $event.srcElement.querySelector('input').focus();
    }
    this.calculateDiscount();
  }

  setCustomAmount($event) {
    $event.srcElement.parentElement.classList.remove("blur");
    if (this.giftCardCustomAmount.value == '' || this.giftCardCustomAmount.value == 0 || this.giftCardCustomAmount.value > this.giftCardMaxPrice || this.giftCardCustomAmount.value < this.giftCardMinPrice) {
      this.giftCardCustomAmount.setValue('Other')
    } else {
      $event.srcElement.parentElement.classList.add("active");
      this.giftCardAmount.setValue(this.giftCardCustomAmount.value);
    }
    this.giftCardCustomAmount.updateValueAndValidity();

    setTimeout(() => {
      this.calculateDiscount();
      // this.payableAmount = this.amountAfterDiscount;
      // this.eWalletMethod.setValue('');
      // this.fromWalletBalance = 0;
    }, 0);
  }

  calculateDiscount() {
    let amount = this.giftCardAmount.value;
    let discount = this.giftCardOfferValue / 100;
    let totDiscount = (amount * discount).toFixed(2);
    this.giftCardDiscount = +totDiscount;
    this.amountAfterDiscount = amount - this.giftCardDiscount;

    let object = {};
    object['giftCardAmount'] = +this.giftCardAmount.value;
    object['giftCardDiscount'] = this.giftCardDiscount;
    object['amountAfterDiscount'] = this.amountAfterDiscount;
    this.amountEvent.emit(object)
  }
}
