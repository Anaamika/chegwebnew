import { TestBed } from '@angular/core/testing';

import { StoresDataProviderService } from './stores-data-provider.service';

describe('StoresDataProviderService', () => {
  let service: StoresDataProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoresDataProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
