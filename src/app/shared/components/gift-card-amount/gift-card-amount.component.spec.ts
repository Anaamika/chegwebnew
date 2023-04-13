import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftCardAmountComponent } from './gift-card-amount.component';

describe('GiftCardAmountComponent', () => {
  let component: GiftCardAmountComponent;
  let fixture: ComponentFixture<GiftCardAmountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftCardAmountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftCardAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
