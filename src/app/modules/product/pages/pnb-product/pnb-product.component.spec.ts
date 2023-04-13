import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PnbProductComponent } from './pnb-product.component';

describe('PnbProductComponent', () => {
  let component: PnbProductComponent;
  let fixture: ComponentFixture<PnbProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PnbProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PnbProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
