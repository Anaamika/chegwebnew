import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardActivitiesComponent } from './reward-activities.component';

describe('RewardActivitiesComponent', () => {
  let component: RewardActivitiesComponent;
  let fixture: ComponentFixture<RewardActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RewardActivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RewardActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
