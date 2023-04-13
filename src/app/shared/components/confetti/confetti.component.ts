import { Component, OnInit, Input } from '@angular/core';

declare var require: any;
const MyPromise = require('promise');
const confetti = require('canvas-confetti');

confetti.Promise = MyPromise;
@Component({
  selector: 'app-confetti',
  templateUrl: './confetti.component.html',
  styleUrls: ['./confetti.component.scss']
})
export class ConfettiComponent implements OnInit {

  @Input() runConfetti;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.runConfetti) {
      this.createConfetti();
    }
  }

  createConfetti() {
    let canvas = document.getElementById('my-canvas');

    // you should  only initialize a canvas once, so save this function
    // we'll save it to the canvas itself for the purpose of this demo
    let myConfetti = confetti.create(canvas, { resize: true });

    myConfetti({
      particleCount: 200,
      startVelocity: 30,
      spread: 360,
      // origin: {
      //   x: Math.random(),
      //   // since they fall down, start a bit higher than random
      //   y: Math.random() - 0.2
      // }
    });
  }
}
