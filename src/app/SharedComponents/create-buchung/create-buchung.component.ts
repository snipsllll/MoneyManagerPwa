import {Component, computed, signal} from '@angular/core';
import {DataService} from "../../Services/DataService/data.service";
import {DialogService} from "../../Services/DialogService/dialog.service";
import {Router} from "@angular/router";
import {Buchung, DayIstBudgets} from "../../Models/Interfaces";
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";
import {UT} from "../../Models/Classes/UT";
import {SettingsService} from "../../Services/SettingsService/settings.service";

@Component({
  selector: 'app-create-buchung',
  templateUrl: './create-buchung.component.html',
  styleUrl: './create-buchung.component.css'
})
export class CreateBuchungComponent {
  buchung!: Buchung;
  oldBuchung!: Buchung;
  buchungen: Buchung[] = []; //für Searchbox

  selectedDate?: string;
  showBetragWarning = false;
  betragWarnung = '';

  isSearchboxVisible = signal<boolean>(false);
  isSaveButtonDisabled = signal<boolean>(true);
  dateUpdated = signal<number>(0);

  availableMoney = computed(() => {
    this.dataService.updated();
    this.dateUpdated();
    return this.dataService.getAvailableMoney(this.buchung.date)
  })

  utils: UT = new UT();

  constructor(private settingsService: SettingsService,
              private dataService: DataService,
              public dialogService: DialogService,
              private router: Router)
  {
    this.buchungen = this.dataService.userData.buchungen.alleBuchungen;

    const date = new Date();
    this.buchung = this.getNewEmptyBuchung(date);
    this.oldBuchung = this.getNewEmptyBuchung(date);

    this.selectedDate = this.buchung.date.toISOString().slice(0, 10);
  }

  onSearchClicked() {
    this.isSearchboxVisible.set(true);
  }

  onSearchboxCloseClicked() {
    this.isSearchboxVisible.set(false);
  }

  onItemSelected(item: Buchung) {
    this.isSearchboxVisible.set(false);
    this.isSaveButtonDisabled.set(false);

    this.buchung.title = item.title;
    this.buchung.apz = item.apz;
    this.buchung.betrag = item.betrag;
    this.buchung.beschreibung = item.beschreibung;
  }

  onSaveClicked() {
    if (this.buchung.betrag !== 0 && this.buchung.betrag !== null) {
      if (!this.isSaveButtonDisabled()) {
        let isBetragZuHoch = this.buchung.apz
          ? this.buchung.betrag! > this.availableMoney().availableForMonth
          : this.buchung.betrag! > this.availableMoney().availableForDay

        if (!isBetragZuHoch) {
          this.dataService.addBuchung(this.buchung);
          this.router.navigate(['/']);
        } else {
          if (this.settingsService.getIsToHighBuchungenEnabled()) {
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
            this.betragWarnung = "der Betrag ist zu hoch!";
            this.showBetragWarning = true;
          }
        }
      }
    } else {
      this.betragWarnung = 'der Betrag darf nicht 0 betragen!';
      this.showBetragWarning = true;
    }
  }

  onCancelClicked() {
    if (this.isBuchungEmpty()) {
      this.router.navigate(['/']);
      return;
    }

    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Abbrechen?',
      message: 'Möchtest du wirklich abbrechen? Alle bisher eingetragenen Daten in der neuen Buchung werden verworfen!',
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
    if (this.selectedDate)
      this.buchung!.date = new Date(this.selectedDate);

    this.updateDate();
    this.updateSaveButton();
  }

  onTimeChange(event: any) {
    const [hours, minutes] = event.target.value.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes);
    this.buchung!.time = date.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
    this.updateSaveButton();
  }

  onBetragChanged() {
    if (this.buchung.betrag !== null)
      this.buchung.betrag = +(this.buchung.betrag!);

    this.updateSaveButton();
  }

  onTitleChanged() {
    this.updateSaveButton();
  }

  onBeschreibungChanged() {
    this.updateSaveButton();
  }

  onApzClicked() {
    this.buchung.apz = !this.buchung.apz;
  }

  private isBuchungEmpty() {
    return ((this.buchung.betrag === null || this.buchung.betrag === 0) && this.buchung.title === '' && this.buchung.beschreibung === '' && this.buchung.date.getDate() === this.oldBuchung.date.getDate() && this.buchung.time === this.oldBuchung.time)
  }

  private isSaveAble() {
    return this.buchung.betrag === null || this.buchung.betrag === 0;
  }

  private updateDate() {
    this.dateUpdated.set(this.dateUpdated() + 1);
  }

  private updateSaveButton() {
    this.isSaveButtonDisabled.set(this.isSaveAble());
  }

  private getNewEmptyBuchung(date: Date) {
    return {
      title: '',
      betrag: null,
      date: date,
      time: date.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'}),
      beschreibung: '',
      apz: false
    };
  }

  protected isAvailableMoneyValid() {
    return this.availableMoney().availableForDay && this.availableMoney().availableForWeek && this.availableMoney().availableForWeek
  }
}
