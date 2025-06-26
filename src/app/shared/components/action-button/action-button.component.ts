import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonName} from '../../enums/button-name';

@Component({
  selector: 'app-action-button',
  standalone: false,

  templateUrl: './action-button.component.html',
  styleUrl: './action-button.component.css'
})
export class ActionButtonComponent {

  protected readonly buttonText = ButtonName;

  // props
  @Input() buttonName!: ButtonName;
  @Input() buttonFunction!: () => void | Promise<void> | Promise<boolean>;  //function to be executed
  // @Output() onClick = new EventEmitter<void>();


 async handleClick() {
   await this.buttonFunction();
  }

  getCssClass(name: string) {
    return name.toLowerCase().replace(/\s+/g, '-');
  }

}
