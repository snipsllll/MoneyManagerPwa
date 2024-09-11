import {Component, computed, OnInit, signal} from '@angular/core';
import {TopbarService} from "../../Services/TopBarService/topbar.service";
import {SparschweinService} from "../../Services/SparschweinService/sparschwein.service";
import {FixKostenEintrag, SparschweinData, SparschweinEintrag} from "../../Models/ClassesInterfacesEnums";
import {ConfirmDialogViewModel} from "../../Models/ConfirmDialogViewModel";
import {DialogService} from "../../Services/DialogService/dialog.service";
import {DataService} from "../../Services/DataService/data.service";

@Component({
  selector: 'app-sparschwein',
  templateUrl: './sparschwein.component.html',
  styleUrl: './sparschwein.component.css'
})
export class SparschweinComponent implements OnInit{

  showCreateDialog = signal<boolean>(false);
  showBetragWarnung = signal<boolean>(false);
  newSpareintrag: SparschweinEintrag = {
    betrag: 0,
    date: new Date(),
    id: 1,
    zusatz: '',
    title: '',
  };

  sparschweinData = computed(() => {
    this.dataService.updated();
    return this.sparschweinService.getData();
  });

  constructor(private dataService: DataService, private dialogService: DialogService, private topbarService: TopbarService, private sparschweinService: SparschweinService) {

  }

  ngOnInit() {
    this.topbarService.title.set('SPARSCHWEIN');
    this.topbarService.dropDownSlidIn.set(false);
    this.topbarService.isDropDownDisabled = true;
  }

  onPlusClicked() {
    this.showCreateDialog.set(true);
  }

  onCreateSpeichernClicked() {
    if(this.darfSpeichern()){
      this.showCreateDialog.set(false);
      this.sparschweinService.addEintrag(this.newSpareintrag);
      this.newSpareintrag = {
        date: new Date(),
        betrag: 0,
        id: -1,
        isMonatEintrag: false
      }
    } else {
      this.showBetragWarnung.set(true);
    }
  }

  onCreateAbbrechenClicked() {
    if (this.isEmpty()){
      this.showCreateDialog.set(false);
      return;
    }
    const dialogViewmodel: ConfirmDialogViewModel = {
      title: 'Abbrechen?',
      message: 'Willst du abbrechen? Alle Änderungen werden verworfen!',
      onConfirmClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        this.showCreateDialog.set(false);
      },
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      }
    }
    this.dialogService.showConfirmDialog(dialogViewmodel);
  }

  darfSpeichern() {
    return this.newSpareintrag.betrag !== 0
  }

  isEmpty() {
    return this.newSpareintrag.betrag === 0 && this.newSpareintrag.title === '' && this.newSpareintrag.zusatz === ''
  }
}
