import { Component } from '@angular/core';
import {versionName} from "../../../Models/Classes/versionName";

@Component({
  selector: 'app-passwort-reset',
  templateUrl: './passwort-reset.component.html',
  styleUrl: './passwort-reset.component.css'
})
export class PasswortResetComponent {

  errorMessage: string = '';
  email: string = '';
  isSaveButtonDisabled: boolean = true;
  wasEmailSend: boolean = false;

  onSendEmailClicked() {

  }

  onEmailChange() {

  }

  protected readonly versionName = versionName;
}
