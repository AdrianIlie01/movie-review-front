import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, Event } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'angular-refresh';
  showLoader = false;
  navigationFailed = false;
  private loaderTimeout: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      // navigate to a route
      if (event instanceof NavigationStart) {
        this.showLoader = true;
        this.navigationFailed = false;

        // fallback for failed navigation
        this.loaderTimeout = setTimeout(() => {
          this.navigationFailed = true;
        }, 10000);
      }

      // navigation ended or failed
      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.clearLoader();
      }
    });
  }

  clearLoader() {
    this.showLoader = false;
    this.navigationFailed = false;
    clearTimeout(this.loaderTimeout);
  }
}
