import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDialogCorpComponent } from './login-dialog-corp.component';

describe('LoginDialogCorpComponent', () => {
  let component: LoginDialogCorpComponent;
  let fixture: ComponentFixture<LoginDialogCorpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginDialogCorpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDialogCorpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
