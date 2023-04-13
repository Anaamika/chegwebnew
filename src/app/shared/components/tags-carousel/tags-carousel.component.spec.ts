import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsCarouselComponent } from './tags-carousel.component';

describe('TagsCarouselComponent', () => {
  let component: TagsCarouselComponent;
  let fixture: ComponentFixture<TagsCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsCarouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
