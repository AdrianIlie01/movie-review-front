import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-not-found-page',
  standalone: false,

  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.css'
})
export class NotFoundPageComponent implements OnInit{

  protected message!: string;

  ngOnInit() {
    this.message = 'message from .ts'
  }

}
