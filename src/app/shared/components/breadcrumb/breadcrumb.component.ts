import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, Event } from '@angular/router';
import { filter, distinctUntilChanged } from 'rxjs/operators';

import { BreadCrumbData } from '@shared/models/breadcrumb-data'
import { utilities } from '@utilities/utilities';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {

  public breadcrumbs: BreadCrumbData[]

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event: Event) => event instanceof NavigationEnd),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
    })
  }
  
  public GetRouterLink() {
    if (utilities.getBankName() == 'MRESULT' || utilities.getBankName() == 'BFSL' ) { return '/account/redeem' }
    else { return '/' }
  }

  buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: BreadCrumbData[] = []): BreadCrumbData[] {
    //If no routeConfig is avalailable we are on the root path
    let label = route.routeConfig && route.routeConfig.data ? route.routeConfig.data.breadcrumb : '';
    let path = route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';
    // If the route is dynamic route such as ':id', remove it
    const lastRoutePart = path.split('/');

    lastRoutePart.forEach(function (elem) {
      const isDynamicRoute = elem.startsWith(':');
      if (isDynamicRoute && !!route.snapshot) {
        const paramName = elem.split(':')[1];
        path = path.replace(elem, route.snapshot.params[paramName]);
        label = route.snapshot.params[paramName];
      }
    });



    // const isDynamicRoute = lastRoutePart.startsWith(':');
    // if (isDynamicRoute && !!route.snapshot) {
    //   const paramName = lastRoutePart.split(':')[1];
    //   path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
    //   label = route.snapshot.params[paramName];
    // }

    //In the routeConfig the complete path is not available,
    //so we rebuild it each time
    const nextUrl = path ? `${url}/${path}` : url;

    const breadcrumb: BreadCrumbData = {
      label: decodeURIComponent(label),
      url: nextUrl,
    };
    // Only adding route with non-empty label
    const newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
    if (route.firstChild) {
      //If we are not on our current path yet,
      //there will be more children to look after, to build our breadcumb
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }

}
