import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StoresDataProviderService } from '@app/core/services/stores-data-provider.service';

@Component({
  selector: 'app-contest',
  templateUrl: './contest.component.html',
  styleUrls: ['./contest.component.scss']
})
export class ContestComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('StoreCarouselWrapper', { static: true }) StoreCarouselWrapper: ElementRef;
  favstoresData = [];
  storesgridData = []
  constructor( private storeService: StoresDataProviderService) { }

  ngOnInit(): void {
    this.getTopStores();
  }
  
  
  private getTopStores() {
    this.storeService.getContestStores().pipe(takeUntil(this.destroy$)).subscribe(res => {
      if (res.length > 0) {
        this.storesgridData = res;
        console.log(this.storesgridData);
      }
    }, err => {
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }

}
