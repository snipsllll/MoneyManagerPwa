import {Component, computed, signal} from '@angular/core';
import {DataService} from "../../Services/DataService/data.service";
import {DialogService} from "../../Services/DialogService/dialog.service";
import {Router} from "@angular/router";
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";
import {UT} from "../../Models/Classes/UT";
import {DataProviderService} from "../../Services/DataProviderService/data-provider.service";
import {DataChangeService} from "../../Services/DataChangeService/data-change.service";
import {IBuchung, IBuchungData, IGeplanteAusgabenKategorie} from "../../Models/NewInterfaces";

@Component({
  selector: 'app-create-buchung',
  templateUrl: './create-buchung.component.html',
  styleUrl: './create-buchung.component.css'
})
export class CreateBuchungComponent {
  buchung!: IBuchungData;
  oldBuchung!: IBuchungData;
  buchungen: IBuchung[] = []; //für Searchbox

  selectedDate?: string;
  showBetragWarning = false;
  betragWarnung = '';
  kategorien = computed<{ id: number, name: string }[]>(() => {
    this.dataService.updated();
    return this.dataProvider.getBuchungsKategorienMitEmpty();
  }) ;
  geplanteAusgabenKategorien!: IGeplanteAusgabenKategorie[];

  isSearchboxVisible = signal<boolean>(false);
  isSaveButtonDisabled = signal<boolean>(true);
  dateUpdated = signal<number>(0);

  availableMoneyCapped = computed(() => {
    this.dataService.updated();
    this.dateUpdated();
    return this.dataProvider.getAvailableMoneyCapped(this.buchung.date)
  })

  availableMonayForGeplanteAusgabenKategorien = computed(() => {
    this.dataService.updated();
    this.dateUpdated();
    let geplanteAusgabenRestgelder = this.dataProvider.getAvailableMoneyForGeplanteAusgabenKategorienForMonth(this.buchung.date);
    return geplanteAusgabenRestgelder[geplanteAusgabenRestgelder.findIndex(eintrag => eintrag.id == this.buchung.buchungsKategorie)]
  })

  utils: UT = new UT();

  constructor(private dataProvider: DataProviderService,
              private dataChangeService: DataChangeService,
              private dataService: DataService,
              public dialogService: DialogService,
              private router: Router)
  {
    this.buchungen = this.dataService.userData.buchungen;

    const date = new Date();
    this.buchung = this.getNewEmptyBuchung(date);
    this.oldBuchung = this.getNewEmptyBuchung(date);

    this.selectedDate = this.buchung.date.toISOString().slice(0, 10);
    this.geplanteAusgabenKategorien = this.dataProvider.getGeplanteAusgabenKategorienForMonth(this.buchung.date);
  }

  onKategorieChanged(): void {
    if(this.buchung.buchungsKategorie == -1) {
      this.dialogService.showBuchungsKategorienDialog();
      this.buchung.buchungsKategorie = 0;
    }
  }

  onplannedKategorieChanged() {
    this.dateUpdated.set(this.dateUpdated() + 1);
    this.updateSaveButton();
  }

  onSearchClicked() {
    this.isSearchboxVisible.set(true);
  }

  onSearchboxCloseClicked() {
    this.isSearchboxVisible.set(false);
  }

  onItemSelected(item: IBuchung) {
    this.isSearchboxVisible.set(false);
    this.isSaveButtonDisabled.set(false);

    this.buchung.title = item.data.title;
    this.buchung.betrag = item.data.betrag;
    this.buchung.beschreibung = item.data.beschreibung;
    this.buchung.buchungsKategorie = item.data.buchungsKategorie;
  }

  onSaveClicked() {
    if (this.buchung.betrag !== 0 && this.buchung.betrag !== null) {
      if (!this.isSaveButtonDisabled()) {
        let isBetragZuHoch = !this.availableMoneyCapped().noData && this.buchung.betrag! > this.availableMoneyCapped().availableForDayIst && this.dataProvider.checkIfMonthExistsForDay(this.buchung.date) && this.dataProvider.getMonthByDate(this.buchung.date).totalBudget !== 0;

        if (!isBetragZuHoch || !this.dataProvider.getMonthByDate(this.buchung!.date) || this.dataProvider.getMonthByDate(this.buchung!.date).totalBudget! < 1) {
          this.dataChangeService.addBuchung(this.buchung);
          this.router.navigate(['home']);
        } else {
          if (this.dataProvider.getSettings().toHighBuchungenEnabled) {
            const confirmDialogViewModel: ConfirmDialogViewModel = {
              title: 'Betrag ist zu hoch',
              message: `Der Betrag überschreitet dein Budget für ${this.buchung!.date.toLocaleDateString() === new Date().toLocaleDateString() ? 'heute' : 'den ' + this.buchung!.date.toLocaleDateString()}. Trotzdem fortfahren?`,
              onCancelClicked: () => {
                this.dialogService.isConfirmDialogVisible = false;
              },
              onConfirmClicked: () => {
                this.dataChangeService.addBuchung(this.buchung);

                this.dialogService.isConfirmDialogVisible = false;
                this.router.navigate(['home']);
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
    if (this.hasBuchungChanges()) {
      this.router.navigate(['home']);
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
        this.router.navigate(['home']);
      }
    }

    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }

  onBackClicked() {
    if (this.hasBuchungChanges()) {
      this.router.navigate(['home']);
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
        this.router.navigate(['home']);
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
      this.buchung.betrag = +(this.buchung.betrag!).toFixed(2);

    this.updateSaveButton();
  }

  onTitleChanged() {
    this.updateSaveButton();
  }

  onBeschreibungChanged() {
    this.updateSaveButton();
  }

  onGeplanteBuchungCheckboxChange() {
    this.updateSaveButton();
  }

  private hasBuchungChanges() {
    return ((this.buchung.betrag === null || this.buchung.betrag === 0) && this.buchung.title === '' && this.buchung.beschreibung === '' && new Date(this.buchung.date).getDate() === new Date(this.oldBuchung.date).getDate() && this.buchung.time === this.oldBuchung.time && this.buchung.buchungsKategorie === 0)
  }

  private isSaveAble() {
    if(this.buchung.betrag === null || this.buchung.betrag === 0){
      return false;
    }

    if(this.buchung.geplanteBuchung && this.buchung.buchungsKategorie === 0) {
      return false;
    }

    return true;
  }

  private updateDate() {
    this.dateUpdated.set(this.dateUpdated() + 1);
  }

  private updateSaveButton() {
    this.isSaveButtonDisabled.set(!this.isSaveAble());
  }

  private getNewEmptyBuchung(date: Date): IBuchungData {
    return {
      title: '',
      betrag: null,
      date: date,
      time: date.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'}),
      buchungsKategorie: 0,
      beschreibung: '',
      geplanteBuchung: false
    };
  }

  protected isAvailableMoneyValid() {
    return this.availableMoneyCapped().availableForDayIst && this.availableMoneyCapped().availableForWeek && this.availableMoneyCapped().availableForWeek
  }
}
