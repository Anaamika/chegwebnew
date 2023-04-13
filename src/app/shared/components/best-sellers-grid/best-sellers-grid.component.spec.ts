import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestSellersGridComponent } from './best-sellers-grid.component';

describe('BestSellersGridComponent', () => {
  let component: BestSellersGridComponent;
  let fixture: ComponentFixture<BestSellersGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestSellersGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestSellersGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
