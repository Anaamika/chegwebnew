import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { StoresDataProviderService } from '@core/services/stores-data-provider.service';
import { TitleService } from '@app/core/services/title.service';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  favstoresData = [];
  storesgridData = []

  constructor(
    private titleService: TitleService,
    private storeService: StoresDataProviderService,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Online shopping, best cashback deals and stores in India");
    this.getAllStores();
  }

  private getAllStores() {
    let stoData = this.storeService.allStores;
    if (stoData.length == 0) {
      this.storeService.storesObservable.pipe(takeUntil(this.destroy$)).subscribe(res => {
        let data = this.storeService.allStores;
        this.buildData(data);
        //this.storesgridData = data;
        this.favstoresData = data.slice(0, 10);
        console.log(this.storesgridData)
      });
    } else {
      this.buildData(stoData); // To avoid browser freezing because of large data 
      //this.storesgridData = stoData;
      this.favstoresData = stoData.slice(0, 10);
    }

    // this.storeService.getallStores()
    //   .pipe(takeUntil(this.destroy$)).subscribe(res => {
    //     if (res.length > 0) {
    //       this.storesgridData = res;
    //       this.favstoresData = res.slice(0, 10)
    //     }
    //   }, err => {
    //   });
  }

  private buildData(stoData) {
    for (let i = 0; i < stoData.length; i++) {
      let item = stoData[i];
      setTimeout(() => {
        this.storesgridData.push(item);
      }, 10 * (i + 1));
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
