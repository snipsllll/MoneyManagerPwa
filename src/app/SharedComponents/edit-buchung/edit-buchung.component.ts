import {Component, computed, OnInit, signal} from '@angular/core';
import {NavigationService} from "../../Services/NavigationService/navigation.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../Services/DataService/data.service";
import {DialogService} from "../../Services/DialogService/dialog.service";
import {Buchung, DayIstBudgets} from "../../Models/Interfaces";
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";
import {UT} from "../../Models/Classes/UT";

@Component({
  selector: 'app-edit-buchung',
  templateUrl: './edit-buchung.component.html',
  styleUrl: './edit-buchung.component.css'
})
export class EditBuchungComponent implements OnInit {
  oldBuchung?: Buchung;
  date?: string;
  showBetragWarning = false;

  buchung = signal<Buchung | undefined>(undefined);
  dateUpdated = signal<number>(0);
  isSaveButtonDisabled = signal<boolean>(true);

  availableMoney = computed(() => {
    this.dataService.updated();
    this.dateUpdated();
    return this.dataService.getAvailableMoney(this.buchung()!.date)
  })

  ut: UT = new UT();

  constructor(private navigationService: NavigationService,
              private router: Router,
              private dataService: DataService,
              private route: ActivatedRoute,
              public dialogService: DialogService)
  { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const buchungsId = +params.get('buchungsId')!;
      this.buchung?.set(this.dataService.getBuchungById(buchungsId));
      this.oldBuchung = {
        date: new Date(this.buchung()!.date),
        beschreibung: this.buchung()!.beschreibung,
        betrag: this.buchung()!.betrag,
        title: this.buchung()!.title,
        time: this.buchung()!.time,
        id: this.buchung()!.id,
        apz: this.buchung()!.apz
      };
      this.date = this.buchung()?.date.toISOString().slice(0, 10);
    })
    this.updateDate();
  }

  onSaveClicked() {
    if (this.buchung()!.betrag !== 0 && this.buchung()!.betrag !== null) {
      if(!this.isSaveButtonDisabled()){
        let isBetragZuHoch = this.buchung()!.apz
          ? this.buchung()!.betrag! > this.availableMoney().availableForMonth
          : this.buchung()!.betrag! > this.availableMoney().availableForDay

        if (!isBetragZuHoch) {
          this.dataService.editBuchung(this.buchung()!);
          this.router.navigate(['/']);
        } else {
          const confirmDialogViewModel: ConfirmDialogViewModel = {
            title: 'Betrag ist zu hoch',
            message: `Der Betrag überschreitet dein Budget für ${this.buchung()!.date.toLocaleDateString() === new Date().toLocaleDateString() ? 'heute' : 'den ' + this.buchung()!.date.toLocaleDateString()}. Trotzdem fortfahren?`,
            onCancelClicked: () => {
              this.dialogService.isConfirmDialogVisible = false;
            },
            onConfirmClicked: () => {
              this.dataService.editBuchung(this.buchung()!);
              this.dialogService.isConfirmDialogVisible = false;
              this.router.navigate(['/']);
            }
          }
          this.dialogService.showConfirmDialog(confirmDialogViewModel);
        }
      }
    } else {
      this.showBetragWarning = true;
    }
  }

  onCancelClicked() {
    this.executeExitAction();
  }

  onDateChange() {
    if (this.date)
      this.buchung()!.date = new Date(this.date);

    this.updateDate();
    this.updateSaveButton();
  }

  onTimeChange(event: any) {
    const [hours, minutes] = event.target.value.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes);
    this.buchung()!.time = date.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
    this.updateSaveButton();
  }

  onBackClicked() {
    this.executeExitAction();
  }

  onBetragChanged() {
    if(this.buchung()!.betrag !== null)
      this.buchung()!.betrag = +(this.buchung()!.betrag!);

    this.updateSaveButton();
  }

  onTitleChanged() {
    this.updateSaveButton();
  }

  onBeschreibungChanged() {
    this.updateSaveButton();
  }

  onApzClicked() {
    this.buchung()!.apz = !this.buchung()?.apz;
    this.updateSaveButton();
  }

  onValueChange() {
    this.updateSaveButton();
  }

  private hasBuchungChanged() {
    return !(this.buchung()!.apz === this.oldBuchung?.apz && this.buchung()!.betrag === this.oldBuchung?.betrag && this.buchung()!.title === this.oldBuchung?.title && this.buchung()!.beschreibung === this.oldBuchung?.beschreibung && this.buchung()!.date.getDate() === this.oldBuchung.date.getDate() && this.buchung()!.time === this.oldBuchung.time)
  }

  private isSaveAble() {
    return (this.buchung()!.betrag === null || this.buchung()!.betrag === 0) && this.hasBuchungChanged();
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
    return this.ut.toFixedDown(this.availableMoney().availableForMonth!+ this.oldBuchung?.betrag! - this.buchung()?.betrag!, 2)
  }

  protected getAvailableMoneyWeek() {
    return this.ut.toFixedDown(this.availableMoney().availableForWeek!+ this.oldBuchung?.betrag! - this.buchung()?.betrag!, 2)
  }

  protected getAvailableMoneyDay() {
    return this.ut.toFixedDown(this.availableMoney().availableForDay!+ this.oldBuchung?.betrag! - this.buchung()?.betrag!, 2)
  }
}
