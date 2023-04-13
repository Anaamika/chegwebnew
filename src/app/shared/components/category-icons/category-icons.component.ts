import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CategoriesDataProviderService } from '@app/core/services/categories-data-provider.service';
import { CategoriesData } from '@app/shared/models/categories-data';
import { utilities } from '@app/utilities/utilities';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-category-icons',
  templateUrl: './category-icons.component.html',
  styleUrls: ['./category-icons.component.scss']
})
export class CategoryIconsComponent implements OnInit {
  @Input() categories;
  @Input() filterChanged;
  destroy$: Subject<boolean> = new Subject<boolean>();

  cat: boolean = false;

  containerActive = false;

  arrCat = [];

  filter: {};
  searchCategories: string = '';
  favcategoriesData: CategoriesData[];
  show: boolean = false;
  @Output() filterEvent = new EventEmitter<object>();
  constructor(
    private categoryService: CategoriesDataProviderService,
    private cd: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
  }
  ngOnChanges() {
    this.cd.detectChanges();
    if (this.categories != undefined) {
      this.show = true;
      if(this.arrCat.length >0){
        this.categories.forEach(element => {
          let present:any = [];
          present = this.arrCat.filter(obj=>obj == element.categoryName);
          if(present.length > 0){
          }else{
            element.selected = false;
          }
        });
      }else{
        this.categories.forEach(element => {
          element.selected = false;
        });
      }
    }
    if (this.filterChanged) {
      this.sendFilter();
    }
  }
  sendFilter() {
    this.filter = {};
    this.filter["category"] = this.arrCat;
    this.filterEvent.emit(this.filter)
  }

  toggleCategory(cat) {

    // for(let i = 0; i < this.cat.length; i++){
    //   this.cat[i].active = false;
    // }
    let item = cat
    if (this.arrCat.indexOf(item.categoryName) == -1) {
      this.arrCat.push(item.categoryName);
      this.sendFilter();
    } else {
      let index = this.arrCat.indexOf(item.categoryName);
      this.arrCat =  this.arrCat.splice(item.categoryName, index);
      this.sendFilter();
    }
    console.log(this.arrCat)
    cat.selected = cat.selected == undefined ? true : !cat.selected;
    console.log('cat', cat);
  }

  remove(arg0: string) {
    throw new Error('Method not implemented.');
  }

  isCatSelected(data) {
    return this.arrCat.indexOf(data) >= 0;
   
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    // Unsubscribe from the subject
    this.destroy$.unsubscribe();
  }
}
