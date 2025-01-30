import {Component, Input, OnInit, signal} from '@angular/core';
import {EditDialogData, EditDialogViewModel} from "../../Models/ViewModels/EditDialogViewModel";
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";
import {DialogService} from "../../Services/DialogService/dialog.service";
import {AbrechnungsMonate, FixkostenPeriods} from "../../Models/Enums";

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.css'
})
export class EditDialogComponent implements OnInit{

  @Input() viewModel!: EditDialogViewModel;
  showBetragWarnung = signal<boolean>(false);
  darfSpeichern = signal<boolean>(false);
  oldEintrag!: EditDialogData;
  selectedPeriod!: string;
  selectedAbrechnungsmonat: string = "";
  months: string[] = Object.values(AbrechnungsMonate); // Extract values from the enum

  constructor(private dialogService: DialogService) {
  }

  ngOnInit() {
    this.oldEintrag = {
      betrag: this.viewModel.data.betrag!,
      title: this.viewModel.data.title ?? '',
      zusatz: this.viewModel.data.zusatz ?? '',
      date: this.viewModel.data.date!,
      id: this.viewModel.data.id,
      vonHeuteAbziehen: this.viewModel.data.vonHeuteAbziehen ?? false,
      period: this.viewModel.data.period ?? FixkostenPeriods.Month
    }

    this.selectedPeriod = this.convertEnumPeriodToStringPeriod(this.viewModel.data.period);
    const key = this.viewModel.data.abrechnungsmonat as keyof typeof AbrechnungsMonate | undefined;
    console.log(this.viewModel.data.abrechnungsmonat)

    if (key !== undefined && key in AbrechnungsMonate !== undefined) {
      this.selectedAbrechnungsmonat = AbrechnungsMonate[key]; // String-Wert aus dem Enum
    } else {
      console.error('Ungültiger period-Wert:', this.viewModel.data.period);
    }
    //const key: keyof typeof AbrechnungsMonate = this.viewModel.data.period; // Key des Enums
    //this.selectedAbrechnungsmonat = AbrechnungsMonate[key]; // String-Wert aus dem Enum

    this.viewModel.isBetragAusgeblendet = this.viewModel.isBetragAusgeblendet ?? false;
  }

  onPeriodChanged() {
    this.viewModel.data.period = this.convertStringPeriodToEnumPeriod(this.selectedPeriod);
    this.onValueChanged();
  }

  onAbrechnungsmonatChanged() {
    const enumValue = Object.values(AbrechnungsMonate).find(month => month === this.selectedAbrechnungsmonat);

    if (enumValue) {
      this.viewModel.data.abrechnungsmonat = enumValue; // Set the enum value
    } else {
      console.error('Selected month does not match any enum value');
    }
    this.onValueChanged();
  }

  convertEnumPeriodToStringPeriod(enumValue?: FixkostenPeriods): string {
    switch (enumValue) {
      case FixkostenPeriods.Month:
        return "Monatlich";
      case FixkostenPeriods.Year:
        return "Jährlich";
      default:
        return "Monatlich";
    }
  }

  convertStringPeriodToEnumPeriod(stringValue: string): FixkostenPeriods {
    switch (stringValue) {
      case 'Monatlich':
        return FixkostenPeriods.Month;
      case 'Jährlich':
        return FixkostenPeriods.Year;
      default:
        return FixkostenPeriods.Month
    }
  }

  onSaveClicked() {
    if(!this.checkBetragValid()) {
      this.showBetragWarnung.set(true);
      return;
    }
    if(this.checkDarfSpeichern()) {
      this.dialogService.isEditDialogVisible = false;
      this.viewModel.onSaveClick(this.viewModel.data);
    }
  }

  onCancelClicked() {
    if(this.checkHasChanged()) {
      const confirmDialogViewModel: ConfirmDialogViewModel = {
        title: 'Abbrechen?',
        message: 'Willst du wirklich abbrechen? Alle nicht gespeicherten Änderungen werden verworfen!',
        onConfirmClicked: () => {
          this.dialogService.isEditDialogVisible = false;
          this.viewModel.onCancelClick();
        },
        onCancelClicked() {}
      }
      this.dialogService.showConfirmDialog(confirmDialogViewModel);
    } else {
      this.dialogService.isEditDialogVisible = false;
      this.viewModel.onCancelClick();
    }
  }

  onBackgroundClicked() {

  }

  onValueChanged() {
    if(this.viewModel.data.betrag !== null && this.viewModel.data.betrag !== undefined)
      this.viewModel.data.betrag = +(this.viewModel.data.betrag?.toFixed(2));

    this.darfSpeichern.set(this.checkDarfSpeichern());
  }

  onVonHeuteAbziehenClicked() {
    this.viewModel.data.vonHeuteAbziehen = !this.viewModel.data.vonHeuteAbziehen;
  }

  private checkDarfSpeichern() {
    return this.checkHasChanged() && this.checkBetragValid()
  }

  private checkBetragValid() {
    return (this.viewModel.data.betrag !== 0 && this.viewModel.data.betrag !== null && this.viewModel.data.betrag !== undefined) || this.viewModel.isBetragAusgeblendet!;
  }

  private checkHasChanged() {
    return (this.oldEintrag.abrechnungsmonat !== this.viewModel.data.abrechnungsmonat || this.oldEintrag.title !== this.viewModel.data.title || this.oldEintrag.period !== this.viewModel.data.period || this.oldEintrag.betrag !== this.viewModel.data.betrag || this.oldEintrag.zusatz !== this.viewModel.data.zusatz)
  }
}
