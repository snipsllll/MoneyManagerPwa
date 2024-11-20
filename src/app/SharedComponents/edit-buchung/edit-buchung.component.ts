import {Component, computed, OnInit, signal} from '@angular/core';
import {NavigationService} from "../../Services/NavigationService/navigation.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../Services/DataService/data.service";
import {DialogService} from "../../Services/DialogService/dialog.service";
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";
import {UT} from "../../Models/Classes/UT";
import {IBuchung} from "../../Models/NewInterfaces";
import {DataProviderService} from "../../Services/DataProviderService/data-provider.service";
import {DataChangeService} from "../../Services/DataChangeService/data-change.service";

@Component({
  selector: 'app-edit-buchung',
  templateUrl: './edit-buchung.component.html',
  styleUrl: './edit-buchung.component.css'
})
export class EditBuchungComponent implements OnInit {
  oldBuchung?: IBuchung;
  date?: string;
  showBetragWarning = false;
  betragWarnung?: string;

  buchung = signal<IBuchung | undefined>(undefined);
  dateUpdated = signal<number>(0);
  isSaveButtonDisabled = signal<boolean>(true);

  availableMoney = computed(() => {
    this.dataService.updated();
    this.dateUpdated();
    return this.dataProvider.getAvailableMoney(this.buchung()!.data.date)
  })

  ut: UT = new UT();

  constructor(
    private dataProvider: DataProviderService,
    private dataChangeService: DataChangeService,
    private navigationService: NavigationService,
    private router: Router,
    private dataService: DataService,
    private route: ActivatedRoute,
    public dialogService: DialogService) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const buchungsId = +params.get('buchungsId')!;
      this.buchung?.set(this.dataProvider.getBuchungById(buchungsId));
      this.oldBuchung = {
        id: this.buchung()!.id,
        data: {
          date: new Date(this.buchung()!.data.date),
          beschreibung: this.buchung()!.data.beschreibung,
          betrag: this.buchung()!.data.betrag,
          title: this.buchung()!.data.title,
          time: this.buchung()!.data.time
        }
      };
      this.date = this.buchung()?.data.date.toISOString().slice(0, 10);
    })
    this.updateDate();
  }

  onSaveClicked() {
    if (this.buchung()!.data.betrag !== 0 && this.buchung()!.data.betrag !== null) {
      if (!this.isSaveButtonDisabled()) {
        let isBetragZuHoch = this.buchung()!.data.betrag! > this.availableMoney().availableForDay

        if (!isBetragZuHoch) {
          this.dataChangeService.editBuchung(this.buchung()!);
          this.router.navigate(['/']);
        } else {
          if(this.dataProvider.getSettings().toHighBuchungenEnabled) {
            const confirmDialogViewModel: ConfirmDialogViewModel = {
              title: 'Betrag ist zu hoch',
              message: `Der Betrag überschreitet dein Budget für ${this.buchung()!.data.date.toLocaleDateString() === new Date().toLocaleDateString() ? 'heute' : 'den ' + this.buchung()!.data.date.toLocaleDateString()}. Trotzdem fortfahren?`,
              onCancelClicked: () => {
                this.dialogService.isConfirmDialogVisible = false;
              },
              onConfirmClicked: () => {
                this.dataChangeService.editBuchung(this.buchung()!);
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
      this.betragWarnung = 'der Betrag darf nicht 0 betragen!'
      this.showBetragWarning = true;
    }
  }

  onCancelClicked() {
    this.executeExitAction();
  }

  onDateChange() {
    if (this.date)
      this.buchung()!.data.date = new Date(this.date);

    this.updateDate();
    this.updateSaveButton();
  }

  onTimeChange(event: any) {
    const [hours, minutes] = event.target.value.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes);
    this.buchung()!.data.time = date.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
    this.updateSaveButton();
  }

  onBackClicked() {
    this.executeExitAction();
  }

  onBetragChanged() {
    if (this.buchung()!.data.betrag !== null)
      this.buchung()!.data.betrag = +(this.buchung()!.data.betrag!);

    this.updateSaveButton();
  }

  onTitleChanged() {
    this.updateSaveButton();
  }

  onBeschreibungChanged() {
    this.updateSaveButton();
  }

  onApzClicked() {
    //this.buchung()!.apz = !this.buchung()?.apz;
    //this.updateSaveButton();
  }

  onValueChange() {
    this.updateSaveButton();
  }

  private hasBuchungChanged() {
    return !(this.buchung()!.data.betrag === this.oldBuchung?.data.betrag && this.buchung()!.data.title === this.oldBuchung?.data.title && this.buchung()!.data.beschreibung === this.oldBuchung?.data.beschreibung && this.buchung()!.data.date.getDate() === this.oldBuchung.data.date.getDate() && this.buchung()!.data.time === this.oldBuchung.data.time)
  }

  private isSaveAble() {
    return (this.buchung()!.data.betrag === null || this.buchung()!.data.betrag === 0) && this.hasBuchungChanged();
  }

  private executeExitAction() {
    if (!this.hasBuchungChanged()) {
      this.router.navigate([this.navigationService.getBackRoute()]);
      return;
    }
    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Abbrechen?',
      message: 'Willst du abbrechen? Alle Änderungen werden verworfen.',
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      },
      onConfirmClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        this.router.navigate([this.navigationService.getBackRoute()]);
      }
    }
    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }

  private updateDate() {
    this.dateUpdated.set(this.dateUpdated() + 1);
  }

  private updateSaveButton() {
    this.isSaveButtonDisabled.set(this.isSaveAble());
  }

  protected getAvailableMoneyMonth() {
    return this.ut.toFixedDown(this.availableMoney().availableForMonth! + this.oldBuchung?.data.betrag! - this.buchung()?.data.betrag!, 2)
  }

  protected getAvailableMoneyWeek() {
    return this.ut.toFixedDown(this.availableMoney().availableForWeek! + this.oldBuchung?.data.betrag! - this.buchung()?.data.betrag!, 2)
  }

  protected getAvailableMoneyDay() {
    return this.ut.toFixedDown(this.availableMoney().availableForDay! + this.oldBuchung?.data.betrag! - this.buchung()?.data.betrag!, 2)
  }
}
