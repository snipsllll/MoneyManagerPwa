import {Component, computed, OnInit, signal} from '@angular/core';
import {NavigationService} from "../../Services/NavigationService/navigation.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../Services/DataService/data.service";
import {DialogService} from "../../Services/DialogService/dialog.service";
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";
import {UT} from "../../Models/Classes/UT";
import {IBuchung, IGeplanteAusgabenKategorie} from "../../Models/NewInterfaces";
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
  kategorien!: { id: number, name: string }[];
  isGeplanteBuchungChecked!: boolean;

  buchung = signal<IBuchung | undefined>(undefined);
  dateUpdated = signal<number>(0);
  isSaveButtonDisabled = signal<boolean>(true);
  geplanteAusgabenKategorien!: IGeplanteAusgabenKategorie[];

  availableMoneyCapped = computed(() => {
    this.dataService.updated();
    this.dateUpdated();
    return this.dataProvider.getAvailableMoneyCapped(this.buchung()!.data.date)
  })

  availableMoney = computed(() => {
    this.dataService.updated();
    this.dateUpdated();
    return this.dataProvider.getAvailableMoney(this.buchung()!.data.date)
  })

  availableMonayForGeplanteAusgabenKategorien = computed(() => {
    this.dataService.updated();
    this.dateUpdated();
    let geplanteAusgabenRestgelder = this.dataProvider.getAvailableMoneyForGeplanteAusgabenKategorienForMonth(this.buchung()!.data.date);
    return geplanteAusgabenRestgelder[geplanteAusgabenRestgelder.findIndex(eintrag => eintrag.id == this.buchung()!.data.buchungsKategorie)]
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
      const geplanteAusgabenBuchungsId = +params.get('geplanteAusgabenBuchungsId')!;

      this.oldBuchung = geplanteAusgabenBuchungsId === 0 ? {...this.dataProvider.getBuchungById(buchungsId)!} : {...this.dataProvider.getGeplanteAusgabenBuchungById(geplanteAusgabenBuchungsId)!};
      console.log(this.oldBuchung)

      this.buchung.set({
        id: this.oldBuchung!.id,
        data: {
          date: new Date(this.oldBuchung!.data.date),
          beschreibung: this.oldBuchung!.data.beschreibung,
          betrag: this.oldBuchung!.data.betrag,
          title: this.oldBuchung!.data.title,
          time: this.oldBuchung!.data.time,
          buchungsKategorie: +(this.oldBuchung!.data.buchungsKategorie)!
        }
      });
      this.date = this.buchung()?.data.date.toISOString().slice(0, 10);
    })
    this.kategorien = this.dataProvider.getBuchungsKategorienMitEmpty();
    console.log(this.kategorien)
    this.geplanteAusgabenKategorien = this.dataProvider.getGeplanteAusgabenKategorienForMonth(this.oldBuchung!.data.date);
    this.isGeplanteBuchungChecked = this.oldBuchung!.data.geplanteBuchung!;
    this.updateDate();
  }

  onGeplanteBuchungChange(newValue: boolean) {
    this.buchung()!.data.geplanteBuchung = newValue;
    this.isGeplanteBuchungChecked = newValue;
  }

  onSaveClicked() {
    if (this.buchung()!.data.betrag !== 0 && this.buchung()!.data.betrag !== null) {
      if (!this.isSaveButtonDisabled()) {
        let isBetragZuHoch = this.isBetragZuHoch();
        if (!isBetragZuHoch || this.dataProvider.getMonthByDate(this.buchung()!.data.date).totalBudget! < 1) {
          if(this.buchung()?.data.geplanteBuchung) {
            if(this.oldBuchung?.data.geplanteBuchung) {
              this.dataChangeService.editGeplanteAusgabeBuchung(this.buchung()!)
            } else {
              this.dataChangeService.addGeplanteAusgabeBuchung(this.buchung()!.data!)
              this.dataChangeService.deleteBuchung(this.buchung()!.id)
            }
          } else {
            if(!this.oldBuchung?.data.geplanteBuchung) {
              this.dataChangeService.editBuchung(this.buchung()!)
            } else {
              this.dataChangeService.addBuchung(this.buchung()!.data!)
              this.dataChangeService.deleteGeplanteAusgabeBuchung(this.buchung()!.id)
            }
          }
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
                if(this.buchung()?.data.geplanteBuchung) {
                  if(this.oldBuchung?.data.geplanteBuchung) {
                    this.dataChangeService.editGeplanteAusgabeBuchung(this.buchung()!)
                  } else {
                    this.dataChangeService.addGeplanteAusgabeBuchung(this.buchung()!.data!)
                    this.dataChangeService.deleteBuchung(this.buchung()!.id)
                  }
                } else {
                  if(!this.oldBuchung?.data.geplanteBuchung) {
                    this.dataChangeService.editBuchung(this.buchung()!)
                  } else {
                    this.dataChangeService.addBuchung(this.buchung()!.data!)
                    this.dataChangeService.deleteGeplanteAusgabeBuchung(this.buchung()!.id)
                  }
                }
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

  isBetragZuHoch() {
    if(this.buchung()?.data.buchungsKategorie == -1) {
      return !this.availableMoneyCapped().noData && this.getRestGeplantAusgabenSumme();
    } else {
      return !this.availableMoneyCapped().noData && this.getAvailableMoneyDay()! < 0
    }

  }

  getRestGeplantAusgabenSumme() {
    let bereitsVerplant = 0;
    const geplanteBuchungenForMonth = this.dataProvider.getGeplanteAusgabenBuchungForMonth(this.dataProvider.getMonthByDate(this.buchung()?.data.date!))

    geplanteBuchungenForMonth.forEach(buchung => {
      bereitsVerplant += buchung.data.betrag ?? 0;
    })

    return this.dataProvider.getGeplanteAusgabenSummeForMonth(this.dataProvider.getMonthByDate(this.buchung()?.data.date!)) - bereitsVerplant;
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

  onBuchungsKategorieChanged() {
    this.updateSaveButton();
  }

  onplannedBuchungsKategorieChanged() {
    this.dateUpdated.set(this.dateUpdated() + 1);
  }

  onApzClicked() {
    //this.buchung()!.apz = !this.buchung()?.apz;
    //this.updateSaveButton();
  }

  onValueChange() {
    this.updateSaveButton();
  }

  private hasBuchungChanged() {
    return !(this.buchung()!.data.buchungsKategorie === this.oldBuchung?.data.buchungsKategorie && this.buchung()!.data.betrag === this.oldBuchung?.data.betrag && this.buchung()!.data.title === this.oldBuchung?.data.title && this.buchung()!.data.beschreibung === this.oldBuchung?.data.beschreibung && this.buchung()!.data.date.getDate() === this.oldBuchung.data.date.getDate() && this.buchung()!.data.time === this.oldBuchung.data.time)
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
    const x = this.ut.toFixedDown(this.availableMoney().availableForMonth! + this.oldBuchung?.data.betrag! - this.buchung()?.data.betrag!, 2)
    return x && x > 0 ? x : 0;
  }

  protected getAvailableMoneyWeek() {
    const x = this.ut.toFixedDown(this.availableMoney().availableForWeek! + this.oldBuchung?.data.betrag! - this.buchung()?.data.betrag!, 2)
    return x && x > 0 ? x : 0;
  }

  protected getAvailableMoneyDay() {
    const x = this.ut.toFixedDown(this.availableMoney().availableForDay! + this.oldBuchung?.data.betrag! - this.buchung()?.data.betrag!, 2);
    return x && x > 0 ? x : 0;
  }
}
