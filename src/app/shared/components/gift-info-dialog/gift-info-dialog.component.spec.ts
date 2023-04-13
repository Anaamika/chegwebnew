import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftInfoDialogComponent } from './gift-info-dialog.component';

describe('GiftInfoDialogComponent', () => {
  let component: GiftInfoDialogComponent;
  let fixture: ComponentFixture<GiftInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
