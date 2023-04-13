import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularStoreGridComponent } from './popular-store-grid.component';

describe('PopularStoreGridComponent', () => {
  let component: PopularStoreGridComponent;
  let fixture: ComponentFixture<PopularStoreGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopularStoreGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularStoreGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
