import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email?: string;
  pw?: string;

  errorMessage?: string = '';

  constructor(private router: Router) {
  }

  onLoginClicked() {
    if(!this.email) {
      this.errorMessage = 'Bitte geben Sie eine Email-adresse an!'
      return;
    }

    if(!this.pw) {
      this.errorMessage = 'Bitte geben Sie ein Passwort an!'
      return;
    }

    this.errorMessage = undefined;
    this.login();
  }

  onRegisterClicked() {
    this.router.navigate(['register']);
  }

  private login() {
    this.router.navigate(['home']);
  }
}
