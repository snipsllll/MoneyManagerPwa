import {Component, OnInit, ViewChild} from '@angular/core';
import {TopbarService} from "../../../Services/TopBarService/topbar.service";
import {DataService} from "../../../Services/DataService/data.service";
import {DialogService} from "../../../Services/DialogService/dialog.service";
import {ConfirmDialogViewModel} from "../../../Models/ViewModels/ConfirmDialogViewModel";
import {DataChangeService} from "../../../Services/DataChangeService/data-change.service";
import {DataProviderService} from "../../../Services/DataProviderService/data-provider.service";
import {TagesAnzeigeOptions, TopBarBudgetOptions} from "../../../Models/Enums";
import {Router} from "@angular/router";
import {AdminService} from "../../../admin.service";
import {UT} from "../../../Models/Classes/UT";
import {NotificationPopupViewModel} from "../../../Models/ViewModels/NotificationPopupViewModel";

@Component({
  selector: 'app-einstellungen',
  templateUrl: './einstellungen.component.html',
  styleUrl: './einstellungen.component.css'
})
export class EinstellungenComponent implements OnInit {

  @ViewChild('fileInput') fileInput: any;
  isEnableToHighBuchungenChecked!: boolean;
  topBarAnzeigeOption!: string;
  tagesAnzeigeOption!: string;
  utils = new UT();
  email: string = '';
  isResetPwLoading = false;
  isResetInfoVisible = false;
  isResetPwTextVisible = true;
  resetPopupViewModel: NotificationPopupViewModel = {
    text: 'Email wurde gesendet!',
    duration: 7000
  }
  isLoading = false;

  constructor(private adminService: AdminService, private router: Router, private dataProvider: DataProviderService, private dataChangeService: DataChangeService, private topbarService: TopbarService, private dataService: DataService, private dialogService: DialogService) {
    this.update();
  }

  ngOnInit() {
    this.topbarService.title.set('EINSTELLUNGEN');
    this.topbarService.dropDownSlidIn.set(false);
    this.topbarService.isDropDownDisabled = true;
    this.email = this.adminService.loggedInUser.getValue()?.email ?? '';
  }

  update() {
    const settings = this.dataProvider.getSettings();
    this.isEnableToHighBuchungenChecked = settings.toHighBuchungenEnabled !== undefined ? settings.toHighBuchungenEnabled : false;
    this.topBarAnzeigeOption = this.getTopBarOptionByNumber(settings.topBarAnzeigeEinstellung);
    this.tagesAnzeigeOption = this.getTagesAnzeigeOptionByNumber(settings.tagesAnzeigeOption);
  }

  onAlleDatenLoeschenClicked() {
    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Alle Daten löschen?',
      message: 'Bist du sicher, dass du alle Daten löschen möchtest? Nicht gespeicherte Daten können nicht wieder hergestellt werden!',
      onConfirmClicked: () => {
        this.isLoading = true;
        this.adminService.deleteAllDataOnServer().then(() => {
          this.dataService.userData.setUserData(this.utils.getEmptyUserData());
          this.dataService.update();
          this.update();
          this.dialogService.isConfirmDialogVisible = false;
          this.isLoading = false;
        });
      },
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      }
    }
    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }

  // Funktion, die den Dateiauswahldialog öffnet
  onFileButtonClick(): void {
    this.fileInput.nativeElement.click();
  }

  // Funktion, die beim Dateiauswahl-Event ausgeführt wird
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    const file: File = input.files[0];
    const reader = new FileReader();

    // Dateiinhalt wird geladen und in der Konsole angezeigt
    reader.onload = (e: any) => {
      const fileContent = e.target.result;
      console.log(JSON.parse(fileContent))
      const confirmDialogViewModel: ConfirmDialogViewModel = {
        title: 'Daten importieren?',
        message: 'Bist du sicher, dass du diese Daten importieren möchtest? Nicht gespeicherte Daten können nicht wieder hergestellt werden!',
        onConfirmClicked: () => {
          this.isLoading = true;
          this.dialogService.isConfirmDialogVisible = false;
          this.dataService.userData.setUserData(JSON.parse(fileContent));
          this.adminService.saveDataOnServer(this.dataService.userData.getFireData()).then(() => {
            this.dataService.update();
            this.update();
            this.isLoading = false;
          });

        },
        onCancelClicked: () => {
          this.dialogService.isConfirmDialogVisible = false;
        }
      }
      this.dialogService.showConfirmDialog(confirmDialogViewModel);
    };

    // Datei als Text lesen
    reader.readAsText(file);
  }

  exportFile(): void {
    // Inhalt der Datei
    const fileContent = JSON.stringify(this.dataService.userData.getSavedData());

    // Erstelle ein Blob-Objekt mit dem Textinhalt und dem MIME-Typ
    const blob = new Blob([fileContent], {type: 'text/plain'});

    // Erstelle einen temporären Link zum Herunterladen der Datei
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'meineDaten.txt'; // Dateiname, der beim Herunterladen angezeigt wird

    // Füge den Link zum DOM hinzu, simuliere einen Klick und entferne ihn dann
    link.click();
    window.URL.revokeObjectURL(link.href); // Speicher freigeben
  }

  async exportFileWithDirectorySelection(): Promise<void> {
    try {
      // Zeige einen Dialog an, in dem der Benutzer einen Ordner auswählen kann
      const handle = await (window as any).showDirectoryPicker();

      // Inhalt der Datei
      const fileContent = JSON.stringify(this.dataService.userData.getSavedData());

      // Erstelle die Datei im ausgewählten Ordner
      const fileHandle = await handle.getFileHandle('meineDaten.txt', {create: true});
      const writableStream = await fileHandle.createWritable();

      // Schreibe den Inhalt in die Datei und schließe den Stream
      await writableStream.write(fileContent);
      await writableStream.close();

      console.log('Datei erfolgreich gespeichert.');
    } catch (error) {
      console.error('Fehler beim Speichern der Datei:', error);
    }
  }

  onZuVielErlaubtClicked() {
    this.dataChangeService.setSettingEnableToHighBuchungen(!this.dataProvider.getSettings().toHighBuchungenEnabled);
    this.isEnableToHighBuchungenChecked = this.dataProvider.getSettings().toHighBuchungenEnabled;
  }

  onAnzeigeObenRechtsChanged() {
    let option = 0;

    switch (this.topBarAnzeigeOption) {
      case 'Restgeld für Monat':
        option = TopBarBudgetOptions.monat;
        break;
      case 'Restgeld für Woche':
        option = TopBarBudgetOptions.woche;
        break;
      case 'Restgeld für Tag (ist)':
        option = TopBarBudgetOptions.tagIst;
        break;
      case 'Restgeld für Tag (soll)':
        option = TopBarBudgetOptions.tagSoll;
        break;
      case 'Ausblenden':
        option = TopBarBudgetOptions.leer;
        break;
    }
    this.dataChangeService.setTopBarAnzeigeOption(option);
  }

  getTopBarOptionByNumber(option: number | undefined) {
    let text = '';

    switch (option) {
      case TopBarBudgetOptions.monat:
        text = 'Restgeld für Monat';
        break;
      case TopBarBudgetOptions.woche:
        text = 'Restgeld für Woche';
        break;
      case TopBarBudgetOptions.tagSoll:
        text = 'Restgeld für Tag (soll)';
        break;
      case TopBarBudgetOptions.tagIst:
        text = 'Restgeld für Tag (ist)';
        break;
      case TopBarBudgetOptions.leer:
        text = 'Ausblenden';
        break;
    }

    return text;
  }

  onTagesAnzeigeChanged() {
    let option = 0;

    switch (this.tagesAnzeigeOption) {
      case 'Ausgaben':
        option = TagesAnzeigeOptions.Tagesausgaben;
        break;
      case 'Restgeld für Tag (soll)':
        option = TagesAnzeigeOptions.RestbetragVonSollBudget;
        break;
      case 'Restgeld für Tag (ist)':
        option = TagesAnzeigeOptions.RestbetragVonIstBetrag;
        break;
      case 'Restgeld für Monat':
        option = TagesAnzeigeOptions.RestMonat;
        break;
      case 'Ausblenden':
        option = TagesAnzeigeOptions.leer;
        break;
    }
    this.dataChangeService.setTagesAnzeigeOption(option);
  }

  getTagesAnzeigeOptionByNumber(option: number | undefined) {
    let text = '';

    switch (option) {
      case TagesAnzeigeOptions.Tagesausgaben:
        text = 'Ausgaben';
        break;
      case TagesAnzeigeOptions.RestbetragVonSollBudget:
        text = 'Restgeld für Tag (soll)';
        break;
      case TagesAnzeigeOptions.RestbetragVonIstBetrag:
        text = 'Restgeld für Tag (ist)';
        break;
      case TagesAnzeigeOptions.RestMonat:
        text = 'Restgeld für Monat';
        break;
      case TagesAnzeigeOptions.leer:
        text = 'Ausblenden';
        break;
    }

    return text;
  }

  onKatVerwaltenClicked() {
    this.dialogService.showBuchungsKategorienDialog();
  }

  onResetPwClicked() {
    this.isResetPwLoading = true;
    this.isResetPwTextVisible = false;
    this.adminService.sendResetPasswordEmail().then(() => {
      this.isResetPwLoading = false;
      this.dialogService.showNotificationPopup(this.resetPopupViewModel);
    }).catch((error) => {
      console.log(error)
      this.isResetPwLoading = false;
      this.isResetPwTextVisible = true;
    });
  }

  onAccountLoeschenClicked() {
    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Account löschen?',
      message: 'Bist du sicher, dass du deinen Account löschen möchtest? Es wird ALLES unwiederrufbar gelöscht!',
      onConfirmClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        this.adminService.deleteAccount();
      },
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      }
    }
    this.dialogService.showConfirmDialog(confirmDialogViewModel);
  }
}
