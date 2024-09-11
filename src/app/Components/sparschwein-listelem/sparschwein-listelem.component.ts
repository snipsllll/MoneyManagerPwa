import {Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {SparschweinEintrag} from "../../Models/ClassesInterfacesEnums";
import {ConfirmDialogViewModel} from "../../Models/ConfirmDialogViewModel";
import {DialogService} from "../../Services/DialogService/dialog.service";
import {SparschweinService} from "../../Services/SparschweinService/sparschwein.service";

@Component({
  selector: 'app-sparschwein-listelem',
  templateUrl: './sparschwein-listelem.component.html',
  styleUrl: './sparschwein-listelem.component.css'
})
export class SparschweinListelemComponent {

  @Input() eintrag!: SparschweinEintrag;
  showMenu = signal<boolean>(false);
  showEditDialog = signal<boolean>(false);
  showBetragWarnung = signal<boolean>(false);
  oldEintrag: SparschweinEintrag = {
    betrag: 0,
    zusatz: '',
    title: '',
    date: new Date(),
    id: 1
  };

  @Output() update = new EventEmitter();

  constructor(private sparscheinService: SparschweinService, private dialogService: DialogService) {
  }

  getTitle() {
    if(!this.eintrag.isMonatEintrag) {
      const art = this.eintrag.betrag > 0 ? 'Einzahlung' : 'Auszahlung';
      const title = this.eintrag.title !== undefined && this.eintrag.title !== '' ? this.eintrag.title : art;
      return `${title} (${this.eintrag.date.toLocaleDateString()})`;
    }
    return `Restgeld: ${this.getMonthNameByIndex(this.eintrag.date.getMonth())} ${this.eintrag.date.getFullYear()}`
  }

  private getMonthNameByIndex(index: number) {
    switch(index){
      case 0:
        return 'Januar';
      case 1:
        return 'Februar';
      case 2:
        return 'März';
      case 3:
        return 'April';
      case 4:
        return 'Mai';
      case 5:
        return 'Juni';
      case 6:
        return 'Juli';
      case 7:
        return 'August';
      case 8:
        return 'September';
      case 9:
        return 'Oktober';
      case 10:
        return 'November';
      case 11:
        return 'Dezember';
    }
    return '';
  }


  onMenuClicked() {
    this.showMenu.set(!this.showMenu());
  }

  onBearbeitenClicked() {
    this.showEditDialog.set(true);
    this.showMenu.set(false);
  }

  onLoeschenClicked() {
    const dialogViewModel: ConfirmDialogViewModel = {
      title: 'Fixkosten-Eintrag löschen?',
      message: 'Willst du diesen Fixkosten-Eintrag löschen? Er kann danach nicht wieder hergestellt werden!',
      onConfirmClicked: () => {
        this.sparscheinService.deleteEintrag(this.eintrag.id!);
        this.update.emit();
        this.dialogService.isConfirmDialogVisible = false;
      },
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        this.showMenu.set(false);
      }
    }
    this.dialogService.showConfirmDialog(dialogViewModel);
  }

  onEditSpeichernClicked() {
    this.showEditDialog.set(false);
    this.sparscheinService.editEintrag(this.eintrag);
    this.oldEintrag = {
      betrag: this.eintrag.betrag,
      title: this.eintrag.title,
      zusatz: this.eintrag.zusatz,
      date: this.eintrag.date,
      id: this.eintrag.id
    }
  }

  onEditAbbrechenClicked() {
    if (!this.hasEintragChanged()){
      this.dialogService.isConfirmDialogVisible = false;
      this.showEditDialog.set(false);
      return;
    }
    const dialogViewmodel: ConfirmDialogViewModel = {
      title: 'Abbrechen?',
      message: 'Willst du abbrechen? Alle Änderungen werden verworfen!',
      onConfirmClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        this.showEditDialog.set(false);
        this.eintrag = this.oldEintrag;
      },
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      }
    }
    this.dialogService.showConfirmDialog(dialogViewmodel);
  }

  onTitelChanged() {

  }

  onBetragChanged() {

  }

  onZusatzChanged() {

  }

  hasEintragChanged() {
    return this.eintrag.title !== this.oldEintrag.title || this.eintrag.zusatz !== this.oldEintrag.zusatz || this.eintrag.betrag !== this.oldEintrag.betrag;
  }

}
