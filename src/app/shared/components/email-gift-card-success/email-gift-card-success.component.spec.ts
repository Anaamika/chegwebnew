import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailGiftCardSuccessComponent } from './email-gift-card-success.component';

describe('EmailGiftCardSuccessComponent', () => {
  let component: EmailGiftCardSuccessComponent;
  let fixture: ComponentFixture<EmailGiftCardSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailGiftCardSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailGiftCardSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
