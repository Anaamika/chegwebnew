import { TestBed } from '@angular/core/testing';

import { OffersDataProviderService } from './offers-data-provider.service';

describe('OffersDataProviderService', () => {
  let service: OffersDataProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OffersDataProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
