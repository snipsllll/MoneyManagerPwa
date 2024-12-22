import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AdminService} from "../../admin.service";
import {versionName} from "../../Models/Classes/versionName";
import {TempService} from "../../temp.service";
import {Location} from '@angular/common';
import {UT} from "../../Models/Classes/UT";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  email?: string;
  pw?: string;
  isPasswordHidden: boolean = true;

  isEmailRed = false;
  isPwRed = false;

  errorMessage?: string = '';

  isLoading = false;
  private utils = new UT();

  constructor(private location: Location, private tempService: TempService, private adminService: AdminService, private router: Router) {
  }

  ngOnInit() {
    if (this.tempService.dataUsedForRegister) {
      this.email = this.tempService.dataUsedForRegister.email;
      this.pw = this.tempService.dataUsedForRegister.password;
      this.tempService.dataUsedForRegister = undefined;
    }

    this.tempService.isTryingAutoLogin.subscribe(isTryingAutoLogin => {
      this.isLoading = isTryingAutoLogin;
    })

    this.tempService.autoLoginError.subscribe(autoLoginError => {
      this.errorMessage = autoLoginError.message ?? '';
    })
  }

  onLoginClicked() {
    this.updateEmailErrors();
    this.updatePasswordErrors();
    this.updateErrorText();

    if (this.utils.isEmailValid(this.email) && this.isPasswordValid()) {
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

  onPwVergessenClicked() {
    this.router.navigate(['resetPassword']);
  }

  private updateEmailErrors() {
    this.isEmailRed = !this.utils.isEmailValid(this.email);
  }

  private updatePasswordErrors() {
    this.isPwRed = !this.isPasswordValid();
  }

  private updateErrorText() {
    if (!this.utils.isEmailValid(this.email)) {
      this.errorMessage = 'Bitte geben Sie eine gültige Email-adresse an!'
      return;
    }

    if (!this.isPasswordValid()) {
      this.errorMessage = 'Bitte geben Sie eine Passwort an!'
    }
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
      await this.adminService.login(this.email, this.pw).then(() => {
        this.isLoading = false;
        this.errorMessage = '';
      });
    } catch (error) {
      this.errorMessage = 'E-Mail-Adresse oder Passwort ist falsch.'
      this.isLoading = false;
    }
  }

  protected readonly versionName = versionName;
}
