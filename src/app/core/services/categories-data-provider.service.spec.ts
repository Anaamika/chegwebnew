import { TestBed } from '@angular/core/testing';

import { CategoriesDataProviderService } from './categories-data-provider.service';

describe('CategoriesDataProviderService', () => {
  let service: CategoriesDataProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriesDataProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
