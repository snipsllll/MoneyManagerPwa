import {Component, Input, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {NavigationService} from "../../../Services/NavigationService/navigation.service";
import {TopbarService} from "../../../Services/TopBarService/topbar.service";
import {DialogService} from "../../../Services/DialogService/dialog.service";
import {DataService} from "../../../Services/DataService/data.service";
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

  constructor(private dataChangeService: DataChangeService, private navigationService: NavigationService, public topbarService: TopbarService, private route: ActivatedRoute, private dataService: DataService, private router: Router, private dialogService: DialogService) {

  }

  ngOnInit() {
    this.topbarService.isDropDownDisabled = false;
  }

  onMenuButtonClicked() {
    this.showMenu.set(!this.showMenu())
  }

  onBuchungClicked(buchungsId: number) {
    this.router.navigate(['/buchungDetails', buchungsId]);
    //this.navigationService.previousRoute = Sites.home;
  }

  onEditButtonClicked(buchungsId: number) {
    this.router.navigate(['/editBuchung', buchungsId]);
  }

  onDeleteButtonClicked() {
    this.showMenu.set(false);
    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Buchung löschen?',
      message: 'Willst du die Buchung wirklich löschen? Sie kann nicht wieder hergestellt werden!',
      onConfirmClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        this.dataChangeService.deleteBuchung(this.buchung.id!);
      },
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      }
    };
    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }
}
