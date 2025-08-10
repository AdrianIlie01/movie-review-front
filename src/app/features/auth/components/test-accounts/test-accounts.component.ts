import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-test-accounts',
  standalone: false,
  templateUrl: './test-accounts.component.html',
  styleUrl: './test-accounts.component.css'
})
export class TestAccountsComponent {

  @Input() form!: FormGroup;

  accounts = [
    { role: 'User', username: 'user', password: 'user', icon: '👤' },
    { role: 'Moderator', username: 'moderator', password: 'moderator', icon: '🛡️' },
    { role: 'Admin', username: 'admin', password: 'admin', icon: '👑' }
  ];

  fillCredentials(username: string, password: string) {
    if (this.form) {
      this.form.patchValue({
        username,
        password
      });
    }
  }
}
