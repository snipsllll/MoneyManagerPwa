import {Component, signal} from '@angular/core';

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrl: './create-dialog.component.css'
})
export class CreateDialogComponent {

  showBetragWarnung = signal<boolean>(false);


  onCancelClicked() {

  }

  onSaveClicked() {

  }

  onBackgroundClicked() {
    console.log(68736742634632872)
  }

}
