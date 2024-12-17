import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AdminService} from "../../admin.service";
import {DialogService} from "../../Services/DialogService/dialog.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  email?: string;
  pw1?: string;
  pw2?: string;

  isEmailRed = false;
  isPw1Red = false;
  isPw2Red = false;

  errorMessage?: string = '';

  isLoading = false;

  constructor(private dialogService: DialogService, private adminService: AdminService, private router: Router) {
  }

  onToLoginClicked() {
    this.email = undefined;
    this.pw1 = undefined;
    this.pw2 = undefined;
    this.router.navigate(['login']);
  }

  onRegisterClicked() {
    this.updateEmailErrors();
    this.updatePw1Errors();
    this.updatePw2Errors();
    this.updateErrorText();

    if(this.isEmailValid() && this.isPw1Valid() && this.isPw2Valid() && this.doPwsMatch()) {
      this.errorMessage = undefined;
      this.register();
    }
  }

  onEmailChange() {
    this.isEmailRed = false;
  }

  onPw1Change() {
    this.isPw1Red = false;
  }

  onPw2Change() {
    this.isPw2Red = false;
  }

  private updateEmailErrors() {
    this.isEmailRed = !this.isEmailValid();
  }

  private updatePw1Errors() {
    this.isPw1Red = !this.isPw1Valid();
  }

  private updatePw2Errors() {
    this.isPw2Red = !this.isPw2Valid();
  }

  private updateErrorText() {
    if(!this.isEmailValid()) {
      this.errorMessage = 'Bitte geben Sie eine gültige Email-adresse an!'
      return;
    }

    if(!this.isPw1Valid()) {
      this.errorMessage = 'Bitte geben Sie ein Passwort an!'
      return;
    }

    if(this.pw1!.length < 6) {
      this.errorMessage = 'Das Passwort muss mindestens 6 Zeichen enthalten!'
      return;
    }

    if(!this.isPw2Valid()) {
      this.errorMessage = 'Bitte geben Sie das Passwort erneut an!'
      return;
    }

    if(!this.doPwsMatch()) {
      this.errorMessage = 'Die angegebene Passwörter stimmen nicht überein!'
      return;
    }

    this.errorMessage = undefined;
  }

  private doPwsMatch() {
    return this.pw1 == this.pw2;
  }

  private isEmailValid() {
    if(!this.email) {
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  private isPw1Valid() {
    if(!this.pw1) {
      return false;
    }

    return true;
  }

  private isPw2Valid() {
    if(!this.pw2) {
      return false;
    }

    return true;
  }

  private register() {
    if(!this.email || !this.pw1) {
      throw new Error('email oder pw war leer');
    }
    this.isLoading = true;
    this.adminService.register(this.email, this.pw1).then(() => {
      this.isLoading = false;
      this.router.navigate(['login']);
      this.dialogService.showNotificationPopup({text: 'Erfolgreich registriert!'});
    });
  }

}
