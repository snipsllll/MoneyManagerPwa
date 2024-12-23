import {Component, Input} from '@angular/core';
import {ZahlungDialogViewModel} from "../../Models/Auswertungen-Interfaces";

@Component({
  selector: 'app-zahlung-dialog',
  templateUrl: './zahlung-dialog.component.html',
  styleUrl: './zahlung-dialog.component.css'
})
export class ZahlungDialogComponent {

  @Input() viewModel?: ZahlungDialogViewModel;
  vollerBetrag: boolean = false;

  onAbortClicked() {
    this.viewModel?.onSaveClicked(this.viewModel!.eintrag)
  }

  onSaveClicked() {
    this.viewModel?.onSaveClicked(this.viewModel!.eintrag)
  }

  onEingegebenerBetragChanged() {
    this.viewModel!.eintrag.betrag = this.viewModel!.zuZahlenderBetrag! - (this.viewModel!.eingegebenerBetrag ?? 0);
  }

}
