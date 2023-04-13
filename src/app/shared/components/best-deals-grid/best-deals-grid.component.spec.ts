import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestDealsGridComponent } from './best-deals-grid.component';

describe('BestDealsGridComponent', () => {
  let component: BestDealsGridComponent;
  let fixture: ComponentFixture<BestDealsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestDealsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestDealsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
