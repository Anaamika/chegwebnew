import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterObject'
})
export class FilterObjectPipe implements PipeTransform {
  transform(items: any[], searchText: string, key: string): any[] {
    if (!items) return [];
    if (!searchText) return items;
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      let str = it[key];
      if (str) {
        return str.toLowerCase().includes(searchText);
      }
    });
  }
}
