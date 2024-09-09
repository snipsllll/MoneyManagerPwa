import { Component } from '@angular/core';

@Component({
  selector: 'app-fix-kosten-eintrag-listelem',
  templateUrl: './fix-kosten-eintrag-listelem.component.html',
  styleUrl: './fix-kosten-eintrag-listelem.component.css'
})
export class FixKostenEintragListelemComponent {
  @Input() fixKostenEintrag!: FixKostenEintrag;
  @Input() selectedElementId!: WritableSignal<number>;

  isSelected = computed(() => {
    return this.selectedElementId() === this.fixKostenEintrag.id;
  })
  showMenu = signal<boolean>(false);
  showEditDialog = signal<boolean>(false);
  showBetragWarnung = signal<boolean>(false);
  oldEintrag!: FixKostenEintrag;

  @Output() onElementClicked = new EventEmitter();
  @Output() update = new EventEmitter();

  constructor(private dialogService: DialogService, private dataService: DataService) {
  }

  ngOnInit() {
    this.oldEintrag = {
      betrag: this.fixKostenEintrag.betrag,
      title: this.fixKostenEintrag.title,
      beschreibung: this.fixKostenEintrag.beschreibung
    }
  }

  onMenuClicked() {
    this.showMenu.set(!this.showMenu());
  }

  onBearbeitenClicked() {
    this.showEditDialog.set(true);
    this.showMenu.set(false);
  }

  onLoeschenClicked() {
    const dialogViewModel: ConfirmDialogViewModel = {
      title: 'Fixkosten-Eintrag löschen?',
      message: 'Willst du diesen Fixkosten-Eintrag löschen? Er kann danach nicht wieder hergestellt werden!',
      onConfirmClicked: () => {
        this.dataService.deleteFixKostenEintrag(this.fixKostenEintrag.id!);
        this.update.emit();
        this.dialogService.isConfirmDialogVisible = false;
      },
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        this.showMenu.set(false);
      }
    }
    this.dialogService.showConfirmDialog(dialogViewModel);
  }

  onEintragClicked() {
    this.onElementClicked.emit();
  }

  onEditSpeichernClicked() {
    this.showEditDialog.set(false);
    this.dataService.editFixKostenEintrag(this.fixKostenEintrag);
    this.oldEintrag = {
      betrag: this.fixKostenEintrag.betrag,
      title: this.fixKostenEintrag.title,
      beschreibung: this.fixKostenEintrag.beschreibung
    }
  }

  onEditAbbrechenClicked() {
    if (!this.hasEintragChanged()){
      this.dialogService.isConfirmDialogVisible = false;
      this.showEditDialog.set(false);
      return;
    }
    const dialogViewmodel: ConfirmDialogViewModel = {
      title: 'Abbrechen?',
      message: 'Willst du abbrechen? Alle Änderungen werden verworfen!',
      onConfirmClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        this.showEditDialog.set(false);
        this.fixKostenEintrag = this.oldEintrag;
      },
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      }
    }
    this.dialogService.showConfirmDialog(dialogViewmodel);
  }

  onTitelChanged() {

  }

  onBetragChanged() {

  }

  onBeschreibungChanged() {

  }

  hasEintragChanged() {
    return this.fixKostenEintrag.title !== this.oldEintrag.title || this.fixKostenEintrag.beschreibung !== this.oldEintrag.beschreibung || this.fixKostenEintrag.betrag !== this.oldEintrag.betrag;
  }
}
