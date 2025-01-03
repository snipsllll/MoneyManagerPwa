import {Component, OnInit, signal} from '@angular/core';
import {NavigationService} from "../../Services/NavigationService/navigation.service";
import {DialogService} from "../../Services/DialogService/dialog.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Sites} from "../../Models/Enums";
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";
import {DataProviderService} from "../../Services/DataProviderService/data-provider.service";
import {IBuchung} from "../../Models/NewInterfaces";
import {DataChangeService} from "../../Services/DataChangeService/data-change.service";
import {getDate} from "../../Models/functions";

@Component({
  selector: 'app-buchung-details',
  templateUrl: './buchung-details.component.html',
  styleUrl: './buchung-details.component.css'
})
export class BuchungDetailsComponent implements OnInit{
  buchung? = signal<IBuchung | undefined>(undefined);
  titelVorhanden = false;

  constructor(private dataChangeService: DataChangeService, private navigationService: NavigationService, private dialogService: DialogService, private router: Router, private route: ActivatedRoute, public dataProvider: DataProviderService) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const buchungsId = +params.get('buchungsId')!;
      const geplanteAusgabenBuchungsId = +params.get('geplanteAusgabenBuchungsId')!;

      this.buchung?.set(geplanteAusgabenBuchungsId === 0 ? {...this.dataProvider.getBuchungById(buchungsId)!} : {...this.dataProvider.getGeplanteAusgabenBuchungById(geplanteAusgabenBuchungsId)!});
      if(this.buchung!()?.data.title !== null && this.buchung!()?.data.title !== undefined && this.buchung!()?.data.title !== '') {
        this.titelVorhanden = true;
      }
    });
    this.navigationService.previousRoute = Sites.home;
    this.dataProvider.getAvailableMoneyForDay(this.buchung!()!.data.date!)
  }

  onBackClicked() {
    this.router.navigate([this.navigationService.getBackRoute()]);
  }

  onDeleteButtonClicked() {
    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Buchung löschen?',
      message: 'Willst du die Buchung wirklich löschen? Sie kann nicht wieder hergestellt werden!',
      onConfirmClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        if(this.buchung!()!.data.geplanteBuchung) {
          this.dataChangeService.deleteGeplanteAusgabeBuchung(this.buchung!()!.id);
        } else {
          this.dataChangeService.deleteBuchung(this.buchung!()!.id!);
        }
        this.router.navigate([this.navigationService.getBackRoute()])
      },
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      }
    };
    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }

  onEditClicked() {
    const buchungsId = this.buchung!()!.data.geplanteBuchung ? 0 : this.buchung!()!.id;
    const geplanteAusgabenBuchungsId = this.buchung!()!.data.geplanteBuchung ? this.buchung!()!.id : 0;
    this.router.navigate(['/editBuchung', buchungsId, geplanteAusgabenBuchungsId]);
    this.navigationService.previousRoute = Sites.buchungDetails;
    this.navigationService.param1 = buchungsId.toString();
    this.navigationService.param2 = geplanteAusgabenBuchungsId.toString();
  }

  protected readonly getDate = getDate;
}
