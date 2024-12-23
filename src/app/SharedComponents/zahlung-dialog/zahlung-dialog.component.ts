import {Component, Input} from '@angular/core';
import {ZahlungDialogViewModel} from "../../Models/Auswertungen-Interfaces";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-zahlung-dialog',
  templateUrl: './zahlung-dialog.component.html',
  styleUrl: './zahlung-dialog.component.css'
})
export class ZahlungDialogComponent {

  @Input() viewModel!: ZahlungDialogViewModel;
  vollerBetrag: boolean = false;
  isSaveAble = new BehaviorSubject<boolean>(false);

  onAbortClicked() {
    this.viewModel?.onSaveClicked(this.viewModel!.eintrag)
  }

  onSaveClicked() {
    if(this.isSaveAble.getValue())
      this.viewModel?.onSaveClicked(this.viewModel!.eintrag)
  }

  onEingegebenerBetragChanged() {
    this.viewModel.eingegebenerBetrag = this.viewModel.eingegebenerBetrag! < this.viewModel.zuZahlenderBetrag! ? this.viewModel.eingegebenerBetrag! : this.viewModel.zuZahlenderBetrag;
    this.viewModel!.eintrag.betrag = this.viewModel!.zuZahlenderBetrag! - (this.viewModel!.eingegebenerBetrag ?? 0);
    this.updateIsSaveAble()
  }

  updateIsSaveAble() {
    this.isSaveAble.next(this.viewModel.eingegebenerBetrag! > 0);
  }

}
