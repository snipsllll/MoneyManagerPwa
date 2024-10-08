import {Component, signal} from '@angular/core';
import {NavigationService} from "../../Services/NavigationService/navigation.service";
import {DialogService} from "../../Services/DialogService/dialog.service";
import {ActivatedRoute, Router} from "@angular/router";
import {DataService} from "../../Services/DataService/data.service";
import {Buchung} from "../../Models/Interfaces";
import {Sites} from "../../Models/Enums";
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";

@Component({
  selector: 'app-buchung-details',
  templateUrl: './buchung-details.component.html',
  styleUrl: './buchung-details.component.css'
})
export class BuchungDetailsComponent {
  buchung? = signal<Buchung | undefined>(undefined);
  titelVorhanden = false;

  constructor(private navigationService: NavigationService, private dialogService: DialogService, private router: Router, private route: ActivatedRoute, private dataService: DataService) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const buchungsId = +params.get('buchungsId')!;
      this.buchung?.set(this.dataService.getBuchungById(buchungsId));
      if(this.buchung!()?.title !== null && this.buchung!()?.title !== undefined && this.buchung!()?.title !== '') {
        this.titelVorhanden = true;
      }
    });
    this.navigationService.previousRoute = Sites.home;
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
        this.dataService.deleteBuchung(this.buchung!()!.id!);
        this.router.navigate([this.navigationService.getBackRoute()])
      },
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      }
    };
    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }

  onEditClicked() {
    this.router.navigate(['/editBuchung', this.buchung!()!.id]);
    this.navigationService.previousRoute = Sites.buchungDetails;
    this.navigationService.param = this.buchung!()!.id!.toString();
  }
}
