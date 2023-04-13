import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mask'
})
export class MaskPipe implements PipeTransform {

  transform(cardNumber: string, visibleDigits: number): string {
    //show number of digits at last based on input
    cardNumber = cardNumber.toString();
    let maskedNumbers = cardNumber.slice(0, -visibleDigits);
    let visibleNumbers = cardNumber.slice(-visibleDigits);
    return maskedNumbers.replace(/./g, '*') + visibleNumbers;
  }

}
