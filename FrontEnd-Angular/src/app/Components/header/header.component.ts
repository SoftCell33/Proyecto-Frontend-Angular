import { Component, OnDestroy, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { AuthServiceService } from '../../Core/Services/auth-service.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy{
  isLoggedIn: boolean = false;
  private authSubscription!: Subscription;

  constructor(
    private viewportScroller: ViewportScroller,
    private authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    
    this.authSubscription = this.authService.authState$.subscribe(
      (isAuthenticated: boolean) => {
        this.isLoggedIn = isAuthenticated;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  scrollToBottom() {
    const height = document.documentElement.scrollHeight;
    this.viewportScroller.scrollToPosition([0, height]);
  }

  logout(): void {
    this.authService.logout();
  }

}

