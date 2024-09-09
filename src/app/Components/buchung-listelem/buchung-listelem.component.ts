import { Component } from '@angular/core';

@Component({
  selector: 'app-buchung-listelem',
  templateUrl: './buchung-listelem.component.html',
  styleUrl: './buchung-listelem.component.css'
})
export class BuchungListelemComponent {
  @Input() buchung!: Buchung;
  showMenu = signal<boolean>(false);

  constructor(private navigationService: NavigationService, public topbarService: TopbarService, private route: ActivatedRoute, private dataService: DataService, private router: Router, private dialogService: DialogService) {

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
        this.dataService.deleteBuchung(this.buchung.id!);
      },
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      }
    };
    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }
}
