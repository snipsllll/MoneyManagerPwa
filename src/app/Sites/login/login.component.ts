import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AdminService} from "../../admin.service";
import {versionName} from "../../Models/Classes/versionName";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email?: string;
  pw?: string;

  isEmailRed = false;
  isPwRed = false;

  errorMessage?: string = '';

  isLoading = false;

  constructor(private adminService: AdminService, private router: Router) {
  }

  onLoginClicked() {
    this.updateEmailErrors();
    this.updatePasswordErrors();
    this.updateErrorText();

    if (this.isEmailValid() && this.isPasswordValid()) {
      this.errorMessage = undefined;
      this.login();
    }
  }

  onEmailChange() {
    this.isEmailRed = false;
  }

  onPwChange() {
    this.isPwRed = false;
  }

  onRegisterClicked() {
    this.router.navigate(['register']);
  }

  private updateEmailErrors() {
    this.isEmailRed = !this.isEmailValid();
  }

  private updatePasswordErrors() {
    this.isPwRed = !this.isPasswordValid();
  }

  private updateErrorText() {
    if (!this.isEmailValid()) {
      this.errorMessage = 'Bitte geben Sie eine gültige Email-adresse an!'
      return;
    }

    if (!this.isPasswordValid()) {
      this.errorMessage = 'Bitte geben Sie eine Passwort an!'
    }
  }

  private isEmailValid() {
    if (!this.email) {
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  private isPasswordValid() {
    if (!this.pw) {
      return false;
    }

    return true;
  }

  private async login() {
    if (!this.email || !this.pw) {
      throw new Error('E-Mail oder Passwort war leer');
    }

    try {
      this.isLoading = true;
      const user = await this.adminService.login(this.email, this.pw);
      this.isLoading = false;
      console.log('Willkommen,', user?.email);
    } catch (error) {
      console.log('Login fehlgeschlagen:', error);
      this.errorMessage = 'E-Mail-Adresse oder Passwort ist falsch.'
      this.isLoading = false;
      // Fehleranzeige im UI (optional)
    }
  }

  protected readonly versionName = versionName;
}
