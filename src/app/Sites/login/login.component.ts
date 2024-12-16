import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AdminService} from "../../admin.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email?: string;
  pw?: string;

  errorMessage?: string = '';

  constructor(private adminService: AdminService, private router: Router) {

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
    if(!this.email || !this.pw) {
      throw new Error('email oder pw war leer');
    }

    this.adminService.login(this.email, this.pw).then(() => {
      this.router.navigate(['home']);
    })
  }
}
