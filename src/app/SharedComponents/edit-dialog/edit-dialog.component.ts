import {Component, signal} from '@angular/core';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.css'
})
export class EditDialogComponent {

  showBetragWarnung = signal<boolean>(false);


  onCancelClicked() {

  }

  onSaveClicked() {

  }

  onBackgroundClicked() {
    console.log(68736742634632872)
  }

}
