import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-read-more',
  templateUrl: './read-more.component.html',
  styleUrls: ['./read-more.component.scss']
})
export class ReadMoreComponent implements OnInit {

  isCollapsed = true;
  //btnShow = false;
  @ViewChild('contentBlock') contentBlock: ElementRef;

  constructor() {
    setTimeout(() => {
      //let ele = document.querySelector('.content_block');
      let ele = this.contentBlock.nativeElement
      let nextElem = this.next(ele);
      let ht = ele.scrollHeight;

      // var lines = ele.textContent.split(/\r\n|\r|\n/);
      // console.log(lines);

      if (ht > 170) {
        if (nextElem)
          nextElem.style.display = 'inline-block';
        //this.btnShow = true
      } else {
        //this.btnShow = false
        if (nextElem)
          nextElem.style.display = 'none';
      }
    }, 50);
  }

  ngOnInit(): void {
  }

  next(elem) {  //get next elemet
    do {
      elem = elem.nextSibling;
    } while (elem && elem.nodeType !== 1);
    return elem;
  }
}
