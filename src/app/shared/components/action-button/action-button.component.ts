import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ActionButton} from '../../enums/action-button';

@Component({
  selector: 'app-action-button',
  standalone: false,

  templateUrl: './action-button.component.html',
  styleUrl: './action-button.component.css'
})
export class ActionButtonComponent {

  protected readonly buttonText = ActionButton;

  @Input() action!: ActionButton;  // Numele acțiunii
  @Input() actionFunction!: () => void | Promise<void> | Promise<boolean>;  // Funcția care se va executa
  // @Output() onClick = new EventEmitter<void>();


 async handleClick() {
   await this.actionFunction();  // Apelează funcția primită ca parametru
  }

  // handleClick(): void {
  //   this.onClick.emit(); // Emiterea evenimentului pentru logica din componenta părinte
  // }
}
