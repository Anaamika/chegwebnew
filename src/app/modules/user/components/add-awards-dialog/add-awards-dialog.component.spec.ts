import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAwardsDialogComponent } from './add-awards-dialog.component';

describe('AddAwardsDialogComponent', () => {
  let component: AddAwardsDialogComponent;
  let fixture: ComponentFixture<AddAwardsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAwardsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAwardsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
