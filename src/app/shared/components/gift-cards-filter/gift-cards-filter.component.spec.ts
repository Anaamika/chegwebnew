import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftCardsFilterComponent } from './gift-cards-filter.component';

describe('GiftCardsFilterComponent', () => {
  let component: GiftCardsFilterComponent;
  let fixture: ComponentFixture<GiftCardsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftCardsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftCardsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
