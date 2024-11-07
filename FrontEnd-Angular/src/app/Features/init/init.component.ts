import { Component } from '@angular/core';
@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrl: './init.component.css'
})
export class InitComponent {
  images: string[] = [
    '/slide1.jpg',
    '/slide2.jpg'
  ];
  
  currentIndex = 0;

  ngOnInit() {}

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  previousSlide() {
    this.currentIndex = this.currentIndex === 0 
      ? this.images.length - 1 
      : this.currentIndex - 1;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }
}
