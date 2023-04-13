import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftCardRedemptionsComponent } from './gift-card-redemptions.component';

describe('GiftCardRedemptionsComponent', () => {
  let component: GiftCardRedemptionsComponent;
  let fixture: ComponentFixture<GiftCardRedemptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftCardRedemptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftCardRedemptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
