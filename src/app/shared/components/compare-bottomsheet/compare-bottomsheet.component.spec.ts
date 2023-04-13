import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareBottomsheetComponent } from './compare-bottomsheet.component';

describe('CompareBottomsheetComponent', () => {
  let component: CompareBottomsheetComponent;
  let fixture: ComponentFixture<CompareBottomsheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareBottomsheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareBottomsheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
