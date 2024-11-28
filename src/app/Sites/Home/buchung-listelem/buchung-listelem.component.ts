import {Component, Input, OnInit, signal} from '@angular/core';
import {Router} from "@angular/router";
import {TopbarService} from "../../../Services/TopBarService/topbar.service";
import {DialogService} from "../../../Services/DialogService/dialog.service";
import {ConfirmDialogViewModel} from "../../../Models/ViewModels/ConfirmDialogViewModel";
import {UT} from "../../../Models/Classes/UT";
import {IBuchung} from "../../../Models/NewInterfaces";
import {DataChangeService} from "../../../Services/DataChangeService/data-change.service";

@Component({
  selector: 'app-buchung-listelem',
  templateUrl: './buchung-listelem.component.html',
  styleUrl: './buchung-listelem.component.css'
})
export class BuchungListelemComponent implements OnInit{
  @Input() buchung!: IBuchung;
  @Input() first?: boolean;
  @Input() last?: boolean;
  showMenu = signal<boolean>(false);
  ut: UT = new UT();

  constructor(private dataChangeService: DataChangeService, public topbarService: TopbarService, private router: Router, private dialogService: DialogService) {

  }

  ngOnInit() {
    this.topbarService.isDropDownDisabled = false;
  }

  onMenuButtonClicked() {
    this.showMenu.set(!this.showMenu())
  }

  onBuchungClicked(buchung: IBuchung) {
    const buchungsId = buchung.data.buchungsKategorie == -1 ? 0 : buchung.id;
    const geplanteAusgabenBuchungsId = buchung.data.buchungsKategorie == -1 ? buchung.id : 0;
    this.router.navigate(['/buchungDetails', buchungsId, geplanteAusgabenBuchungsId]);
    //this.navigationService.previousRoute = Sites.home;
  }

  onEditButtonClicked(buchung: IBuchung) {
    const buchungsId = buchung.data.buchungsKategorie == -1 ? 0 : buchung.id;
    const geplanteAusgabenBuchungsId = buchung.data.buchungsKategorie == -1 ? buchung.id : 0;
    this.router.navigate(['/editBuchung', buchungsId, geplanteAusgabenBuchungsId]);
  }

  onDeleteButtonClicked() {
    this.showMenu.set(false);
    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Buchung löschen?',
      message: 'Willst du die Buchung wirklich löschen? Sie kann nicht wieder hergestellt werden!',
      onConfirmClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        if(this.buchung.data.buchungsKategorie == -1) {
          this.dataChangeService.deleteGeplanteAusgabeBuchung(this.buchung.id);
        } else {
          this.dataChangeService.deleteBuchung(this.buchung.id!);
        }
      },
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      }
    };
    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }
}
