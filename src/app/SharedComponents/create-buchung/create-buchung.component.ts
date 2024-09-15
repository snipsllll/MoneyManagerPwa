import {Component, signal} from '@angular/core';
import {DataService} from "../../Services/DataService/data.service";
import {DialogService} from "../../Services/DialogService/dialog.service";
import {Router} from "@angular/router";
import {Buchung, DayIstBudgets} from "../../Models/Interfaces";
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";

@Component({
  selector: 'app-create-buchung',
  templateUrl: './create-buchung.component.html',
  styleUrl: './create-buchung.component.css'
})
export class CreateBuchungComponent {
  buchung!: Buchung;
  oldBuchung!: Buchung;
  showBetragWarning = false;
  date?: string;
  dayBudget = signal<DayIstBudgets>({dayIstBudget: 0, weekIstBudget: 0, monthIstBudget: 0});
  saveButtonDisabled = signal<boolean>(true);

  constructor(private dataService: DataService, public dialogService: DialogService, private router: Router) {
    const date = new Date();

    this.buchung = {
      title: '',
      betrag: null,
      date: date,
      time: date.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'}),
      beschreibung: '',
      apz: false
    };
    this.oldBuchung = {
      title: '',
      betrag: null,
      date: new Date(this.buchung.date),
      time: this.buchung.time,
      beschreibung: '',
      apz: false
    };
    this.dayBudget.set(this.dataService.getDayIstBudgets(date)!);
    this.date = this.buchung.date.toISOString().slice(0, 10);
  }

  onSaveClicked() {
    if (this.buchung.betrag !== 0 && this.buchung.betrag !== null) {
      if (!this.saveButtonDisabled()) {
        let showConfDialog = false;
        if(this.buchung.apz === true){
          console.log(this.dataService.getBudgetInfosForMonth(this.buchung.date!)?.budget!)
          showConfDialog = (this.buchung.betrag! > this.dataService.getBudgetInfosForMonth(this.buchung.date!)?.budget!);
        } else {
          showConfDialog = (this.dayBudget() !== null && this.dayBudget().dayIstBudget !== undefined && this.dayBudget().dayIstBudget! < this.buchung.betrag!);
        }

        if (showConfDialog) {
          const confirmDialogViewModel: ConfirmDialogViewModel = {
            title: 'Betrag ist zu hoch',
            message: `Der Betrag überschreitet dein Budget für ${this.buchung!.date.toLocaleDateString() === new Date().toLocaleDateString() ? 'heute' : 'den ' + this.buchung!.date.toLocaleDateString()}. Trotzdem fortfahren?`,
            onCancelClicked: () => {
              this.dialogService.isConfirmDialogVisible = false;
            },
            onConfirmClicked: () => {
              this.dataService.addBuchung(this.buchung);
              this.dialogService.isConfirmDialogVisible = false;
              this.router.navigate(['/']);
            }
          }
          this.dialogService.showConfirmDialog(confirmDialogViewModel);
        } else {
          this.dataService.addBuchung(this.buchung);
          this.router.navigate(['/']);
        }
      }
    } else {
      this.showBetragWarning = true;
    }
  }

  onCancelClicked() {
    if (this.isBuchungEmpty()) {
      this.router.navigate(['/']);
      return;
    }
    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Cancel?',
      message: 'Do you really want to cancel? All changes will be lost!',
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      },
      onConfirmClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        this.router.navigate(['/']);
      }
    }
    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }

  onBackClicked() {
    if (this.isBuchungEmpty()) {
      this.router.navigate(['/']);
      return;
    }
    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Abbrechen?',
      message: 'Willst du verlassen? Alle Änderungen werden verworfen.',
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      },
      onConfirmClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        this.router.navigate(['/']);
      }
    }
    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }

  onDateChange() {
    if (this.date)
      this.buchung!.date = new Date(this.date);

    this.dayBudget.set(this.dataService.getDayIstBudgets(this.buchung.date) ?? {
      monthIstBudget: undefined,
      dayIstBudget: undefined,
      weekIstBudget: undefined
    });
    this.saveButtonDisabled.set(this.isSaveAble());
  }

  onTimeChange(event: any) {
    const [hours, minutes] = event.target.value.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes);
    this.buchung!.time = date.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
    this.saveButtonDisabled.set(this.isSaveAble());
  }

  onBetragChanged() {
    if (this.buchung.betrag !== null) {
      this.buchung.betrag = +(this.buchung.betrag!);
    }
    this.saveButtonDisabled.set(this.isSaveAble());
  }

  onTitleChanged() {
    this.saveButtonDisabled.set(this.isSaveAble());
  }

  onBeschreibungChanged() {
    this.saveButtonDisabled.set(this.isSaveAble());
  }

  onApzClicked() {
    this.buchung.apz = !this.buchung.apz;
  }

  toFixedDown(number?: number, decimals?: number): number | undefined {
    if(number === undefined) {
      return undefined;
    }
    const numberString = number.toString();
    if(numberString.indexOf(".") === -1) {
      return number;
    } else if(numberString.indexOf(".") === numberString.length - 2) {
      const numberVorKomma = numberString.substring(0, numberString.indexOf("."));
      let numberNachKomma = numberString.substring(numberString.indexOf(".") + 1, numberString.length);
      numberNachKomma = numberNachKomma.substring(0, decimals);
      return +numberVorKomma > 0 ? (+numberVorKomma) + (+numberNachKomma / 10) : (+numberVorKomma) - (+numberNachKomma / 10);
    }
    const numberVorKomma = numberString.substring(0, numberString.indexOf("."));
    let numberNachKomma = numberString.substring(numberString.indexOf(".") + 1, numberString.length);
    numberNachKomma = numberNachKomma.substring(0, decimals);
    return +numberVorKomma > 0 ? (+numberVorKomma) + (+numberNachKomma / 100) : (+numberVorKomma) - (+numberNachKomma / 100);
  }

  private isBuchungEmpty() {
    return ((this.buchung.betrag === null || this.buchung.betrag === 0) && this.buchung.title === '' && this.buchung.beschreibung === '' && this.buchung.date.getDate() === this.oldBuchung.date.getDate() && this.buchung.time === this.oldBuchung.time)
  }

  private isSaveAble() {
    return this.buchung.betrag === null || this.buchung.betrag === 0;
  }
}
