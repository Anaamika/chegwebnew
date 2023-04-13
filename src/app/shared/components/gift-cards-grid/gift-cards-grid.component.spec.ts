import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftCardsGridComponent } from './gift-cards-grid.component';

describe('GiftCardsGridComponent', () => {
  let component: GiftCardsGridComponent;
  let fixture: ComponentFixture<GiftCardsGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftCardsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftCardsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
