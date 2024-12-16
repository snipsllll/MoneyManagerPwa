import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AdminService} from "../../admin.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  email?: string;
  pw1?: string;
  pw2?: string;

  errorMessage?: string = '';

  constructor(private adminService: AdminService, private router: Router) {
  }

  onToLoginClicked() {
    this.email = undefined;
    this.pw1 = undefined;
    this.pw2 = undefined;
    this.router.navigate(['login']);
  }

  onRegisterClicked() {
    if(!this.email) {
      this.errorMessage = 'Bitte geben Sie eine Email-adresse an!'
      return;
    }

    if(!this.pw1) {
      this.errorMessage = 'Bitte geben Sie ein Passwort an!'
      return;
    }

    if(this.pw1.length < 6) {
      this.errorMessage = 'Das Passwort muss mindestens 6 Zeichen enthalten!'
      return;
    }

    if(!this.pw2) {
      this.errorMessage = 'Bitte geben Sie das Passwort zwei mal an!'
      return;
    }

    if(this.pw1 != this.pw2) {
      this.errorMessage = 'Die angegebene Passwörter stimmen nicht überein!'
      return;
    }

    this.errorMessage = undefined;
    this.register();
  }

  private register() {
    if(!this.email || !this.pw1) {
      throw new Error('email oder pw war leer');
    }
    this.adminService.register(this.email, this.pw1);
  }

}
