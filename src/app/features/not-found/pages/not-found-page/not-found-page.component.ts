import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  standalone: false,

  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.css'
})
export class NotFoundPageComponent implements OnInit{

  protected message!: string;
  protected countdown = 10;
  private intervalId!: number;

  constructor(private router: Router) {}

  ngOnInit() {
    this.message = 'Oops! The page you’re looking for doesn’t exist or has been moved.';

    this.intervalId = window.setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(this.intervalId);
        this.router.navigate(['home']);
      }
    }, 1000);
  }

  redirectNow(): void {
    clearInterval(this.intervalId);
    this.router.navigate(['home']);
  }
}
