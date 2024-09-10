import {Component, OnInit, signal} from '@angular/core';
import {ConfirmDialogViewModel} from "../../Models/ConfirmDialogViewModel";
import {Buchung, DayIstBudgets} from "../../Models/ClassesInterfacesEnums";
import {NavigationService} from "../../Services/NavigationService/navigation.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../Services/DataService/data.service";
import {DialogService} from "../../Services/DialogService/dialog.service";

@Component({
  selector: 'app-edit-buchung',
  templateUrl: './edit-buchung.component.html',
  styleUrl: './edit-buchung.component.css'
})
export class EditBuchungComponent implements OnInit {
  buchung = signal<Buchung | undefined>(undefined);
  oldBuchung?: Buchung;
  date?: string;
  dayBudget = signal<DayIstBudgets>({dayIstBudget: 0, weekIstBudget: 0, monthIstBudget: 0});
  showBetragWarning = false;
  saveButtonDisabled = signal<boolean>(true);

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
        id: this.buchung()!.id
      };
      this.date = this.buchung()?.date.toISOString().slice(0, 10);
    })
    this.dayBudget.set(this.dataService.getDayIstBudgets(this.buchung()!.date)!);
  }

  onSaveClicked() {
    if (this.buchung()!.betrag !== 0 && this.buchung()!.betrag !== null) {
      if(!this.saveButtonDisabled()){
        if (this.dayBudget() !== null && this.dayBudget().dayIstBudget !== undefined && this.dayBudget().dayIstBudget! < this.buchung()!.betrag!) {
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
    this.dayBudget.set(this.dataService.getDayIstBudgets(this.buchung()!.date)!);
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
      this.buchung()!.betrag = +(this.buchung()!.betrag!.toFixed(2));
    }
    this.saveButtonDisabled.set(this.isSaveAble());
  }

  onTitleChanged() {
    this.saveButtonDisabled.set(this.isSaveAble());
  }

  onBeschreibungChanged() {
    this.saveButtonDisabled.set(this.isSaveAble());
  }

  private hasBuchungChanged() {
    return !(this.buchung()!.betrag === this.oldBuchung?.betrag && this.buchung()!.title === this.oldBuchung?.title && this.buchung()!.beschreibung === this.oldBuchung?.beschreibung && this.buchung()!.date.getDate() === this.oldBuchung.date.getDate() && this.buchung()!.time === this.oldBuchung.time)
  }

  private isSaveAble() {
    return (this.buchung()!.betrag === null || this.buchung()!.betrag === 0) && this.hasBuchungChanged();
  }
}
