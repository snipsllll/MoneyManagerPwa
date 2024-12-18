import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AdminService} from "../../admin.service";
import {versionName} from "../../Models/Classes/versionName";
import {TempService} from "../../temp.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  email?: string;
  pw?: string;
  isPasswordHidden: boolean = true;

  isEmailRed = false;
  isPwRed = false;

  errorMessage?: string = '';

  isLoading = false;

  constructor(private tempService: TempService, private adminService: AdminService, private router: Router) {
  }

  ngOnInit() {
    if(this.tempService.dataUsedForRegister) {
      this.email = this.tempService.dataUsedForRegister.email;
      this.pw = this.tempService.dataUsedForRegister.password;
      this.tempService.dataUsedForRegister = undefined;
    }
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

  onHidePasswordClicked() {
    this.isPasswordHidden = true;
  }

  onShowPasswordClicked() {
    this.isPasswordHidden = false;
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
    }
  }

  protected readonly versionName = versionName;
}
