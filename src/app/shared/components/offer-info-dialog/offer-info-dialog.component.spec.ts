import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferInfoDialogComponent } from './offer-info-dialog.component';

describe('OfferInfoDialogComponent', () => {
  let component: OfferInfoDialogComponent;
  let fixture: ComponentFixture<OfferInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
