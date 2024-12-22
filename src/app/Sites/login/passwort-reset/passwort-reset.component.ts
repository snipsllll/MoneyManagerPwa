import { Component } from '@angular/core';
import {versionName} from "../../../Models/Classes/versionName";
import {UT} from "../../../Models/Classes/UT";
import {AdminService} from "../../../admin.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-passwort-reset',
  templateUrl: './passwort-reset.component.html',
  styleUrl: './passwort-reset.component.css'
})
export class PasswortResetComponent {

  errorMessage: string = '';
  email: string = 'tuemmers.paypal@gmail.com';
  isSaveButtonDisabled: boolean = true;
  wasEmailSend: boolean = false;
  isLoading = false;
  private utils = new UT();

  constructor(private adminService: AdminService, private router: Router) {
    this.updateSaveButton();
  }

  onSendEmailClicked() {
    this.sendEmail();
  }

  onSendAgainClicked() {
    this.sendEmail();
  }

  onEmailChange() {
    this.updateSaveButton();
  }

  onBackClicked() {
    this.router.navigate([('')]);
  }

  private sendEmail() {
    this.updateSaveButton();
    this.errorMessage = '';

    if(!this.isSaveButtonDisabled){
      this.isLoading = true;
      this.adminService.sendResetPasswordEmail(this.email).then(result => {
        this.isLoading = false;
        this.wasEmailSend = true;
      }).catch((error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      });
    }
  }

  private updateSaveButton() {
    this.isSaveButtonDisabled = !this.utils.isEmailValid(this.email);
  }

  protected readonly versionName = versionName;
}
