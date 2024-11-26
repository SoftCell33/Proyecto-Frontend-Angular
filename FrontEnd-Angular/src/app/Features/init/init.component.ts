import { Component } from '@angular/core';
import { ViewportScroller } from '@angular/common';
@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrl: './init.component.css'
})
export class InitComponent {
  constructor(private viewportScroller: ViewportScroller) {}

  scrollToTop() {
    this.viewportScroller.scrollToPosition([0, 0]);
  }
}
