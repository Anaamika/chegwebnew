import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeemCreditsDialogComponent } from './redeem-credits-dialog.component';

describe('RedeemCreditsDialogComponent', () => {
  let component: RedeemCreditsDialogComponent;
  let fixture: ComponentFixture<RedeemCreditsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedeemCreditsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeemCreditsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
