import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopGiftCardsComponent } from './top-gift-cards.component';

describe('TopGiftCardsComponent', () => {
  let component: TopGiftCardsComponent;
  let fixture: ComponentFixture<TopGiftCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopGiftCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopGiftCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
