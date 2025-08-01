import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-redirect-loader',
  standalone: false,
  templateUrl: './redirect-loader.component.html',
  styleUrl: './redirect-loader.component.css'
})
export class RedirectLoaderComponent {
  @Input() navigationFailed = false;
  @Output() close = new EventEmitter<void>();

  handleClick() {
    this.close.emit();
  }
}
