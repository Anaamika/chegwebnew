import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteSearchboxComponent } from './autocomplete-searchbox.component';

describe('AutocompleteSearchboxComponent', () => {
  let component: AutocompleteSearchboxComponent;
  let fixture: ComponentFixture<AutocompleteSearchboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutocompleteSearchboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteSearchboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
