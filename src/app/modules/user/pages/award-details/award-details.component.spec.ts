import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardDetailsComponent } from './award-details.component';

describe('AwardDetailsComponent', () => {
  let component: AwardDetailsComponent;
  let fixture: ComponentFixture<AwardDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
