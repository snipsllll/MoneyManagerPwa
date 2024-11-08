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
  buchung = signal<Buchung | undefined>(undefined);
  oldBuchung?: Buchung;
  date?: string;
  dateUpdated = signal<number>(0);
  availableMoney = computed(() => {
    this.dataService.updated();
    this.dateUpdated();
    return this.dataService.getAvailableMoney(this.buchung()!.date)
  })
  showBetragWarning = false;
  saveButtonDisabled = signal<boolean>(true);
  ut: UT = new UT();

  constructor(private navigationService: NavigationService, private router: Router, private dataService: DataService, private route: ActivatedRoute, public dialogService: DialogService) {

  }

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
    this.dateUpdated.set(this.dateUpdated() + 1);
  }

  onSaveClicked() {
    if (this.buchung()!.betrag !== 0 && this.buchung()!.betrag !== null) {
      if(!this.saveButtonDisabled()){
        let showConfDialog: boolean;
        if(this.buchung()!.apz){
          showConfDialog = (this.buchung()!.betrag! > this.dataService.getBudgetInfosForMonth(this.buchung()!.date!)?.budget!);
        } else {
          showConfDialog = ( this.buchung()?.betrag !== this.oldBuchung?.betrag && this.availableMoney() !== null && this.availableMoney().availableForDay !== undefined && this.availableMoney().availableForDay! < this.buchung()!.betrag!);
        }

        if (showConfDialog) {
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
        } else {
          this.dataService.editBuchung(this.buchung()!);
          this.router.navigate(['/']);
        }
      }
    } else {
      this.showBetragWarning = true;
    }
  }

  onCancelClicked() {
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

  onDateChange() {
    if (this.date)
      this.buchung()!.date = new Date(this.date);
    this.dateUpdated.set(this.dateUpdated() + 1);
    this.saveButtonDisabled.set(this.isSaveAble());
  }

  onTimeChange(event: any) {
    const [hours, minutes] = event.target.value.split(':');
    const date = new Date();
    date.setHours(+hours, +minutes);
    this.buchung()!.time = date.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
    this.saveButtonDisabled.set(this.isSaveAble());
  }

  onBackClicked() {
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
        this.router.navigate([this.navigationService.getBackRoute()])
      }
    }
    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }

  onBetragChanged() {
    if(this.buchung()!.betrag !== null) {
      this.buchung()!.betrag = +(this.buchung()!.betrag!);
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
    this.buchung()!.apz = !this.buchung()?.apz;
    this.saveButtonDisabled.set(this.isSaveAble());
  }

  onValueChange() {
    this.saveButtonDisabled.set(this.isSaveAble());
  }

  private hasBuchungChanged() {
    return !(this.buchung()!.apz === this.oldBuchung?.apz && this.buchung()!.betrag === this.oldBuchung?.betrag && this.buchung()!.title === this.oldBuchung?.title && this.buchung()!.beschreibung === this.oldBuchung?.beschreibung && this.buchung()!.date.getDate() === this.oldBuchung.date.getDate() && this.buchung()!.time === this.oldBuchung.time)
  }

  private isSaveAble() {
    return (this.buchung()!.betrag === null || this.buchung()!.betrag === 0) && this.hasBuchungChanged();
  }
}
