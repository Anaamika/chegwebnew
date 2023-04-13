import { Component, OnInit, OnDestroy, } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { DataService } from '@core/services/data.service';
import { StorageService } from '@core/services/storage.service';
import { AppConstants } from '@config/app-constants'
import { ApiConstants } from '@config/api-constants';
import { TitleService } from '@app/core/services/title.service';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss']
})
export class CompareComponent implements OnInit, OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  compareData = [];

  constructor(
    private titleService: TitleService,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private storageService: StorageService,
  ) {
    router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {

      let ids = decodeURIComponent(this.route.snapshot.paramMap.get('ids'));
      let catName = decodeURIComponent(this.route.snapshot.paramMap.get('cn'));
      let title = decodeURIComponent(this.route.snapshot.paramMap.get('qry'));

      this.getCompareData(catName, ids);
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle("Lowest ever price deals with the best price comparison in India ");
    this.titleService.updateDescription("Compare product prices from top online stores in one place, get the best deal, shop and save.");
  }

  getCompareData(catName, ids) {
    this.dataService.parseApiCall(`${ApiConstants.URL.GET_COMPARE_DATA}catName=${catName}&&compareId=${ids}`,
      'get',
      '',
      this.storageService.getTokenHeader()).pipe(takeUntil(this.destroy$)).subscribe(res => {
        if (res.length > 0) {
          this.compareData = res;
          console.log(this.compareData)
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
