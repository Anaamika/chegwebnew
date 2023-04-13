import { TestBed } from '@angular/core/testing';

import { OfferDialogService } from './offer-dialog.service';

describe('OfferDialogService', () => {
  let service: OfferDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfferDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
