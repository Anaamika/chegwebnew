import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftCardDialogComponent } from './gift-card-dialog.component';

describe('GiftCardDialogComponent', () => {
  let component: GiftCardDialogComponent;
  let fixture: ComponentFixture<GiftCardDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftCardDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftCardDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
