import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoresGridComponent } from './stores-grid.component';

describe('StoresGridComponent', () => {
  let component: StoresGridComponent;
  let fixture: ComponentFixture<StoresGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoresGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoresGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
