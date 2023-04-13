import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoSearchboxComponent } from './auto-searchbox.component';

describe('AutoSearchboxComponent', () => {
  let component: AutoSearchboxComponent;
  let fixture: ComponentFixture<AutoSearchboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoSearchboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoSearchboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
