import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  protected currentYear: number = new Date().getFullYear();
  protected email: string = 'ilieadrian01@yahoo.com';
}
