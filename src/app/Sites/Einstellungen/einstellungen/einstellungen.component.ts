import {Component, OnInit, ViewChild} from '@angular/core';
import {TopbarService} from "../../../Services/TopBarService/topbar.service";
import {DataService} from "../../../Services/DataService/data.service";
import {DialogService} from "../../../Services/DialogService/dialog.service";
import {ConfirmDialogViewModel} from "../../../Models/ViewModels/ConfirmDialogViewModel";

@Component({
  selector: 'app-einstellungen',
  templateUrl: './einstellungen.component.html',
  styleUrl: './einstellungen.component.css'
})
export class EinstellungenComponent implements OnInit{

  @ViewChild('fileInput') fileInput: any;

  constructor(private topbarService: TopbarService, private dataService: DataService, private dialogService: DialogService) {
  }

  ngOnInit() {
    this.topbarService.title.set('EINSTELLUNGEN');
    this.topbarService.dropDownSlidIn.set(false);
    this.topbarService.isDropDownDisabled = true;
  }

  onAlleDatenLoeschenClicked() {
    const confirmDialogViewModel: ConfirmDialogViewModel = {
    title: 'Alle Daten löschen?',
    message: 'Bist du sicher, dass du alle Daten löschen möchtest? Nicht gespeicherte Daten können nicht wieder hergestellt werden!',
    onConfirmClicked: () => {
      this.dataService.save({savedMonths: [], fixKosten: [], sparEintraege: [], wunschlistenEintraege: [], buchungen: []})
      this.dialogService.isConfirmDialogVisible = false;
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
      const confirmDialogViewModel: ConfirmDialogViewModel = {
        title: 'Daten importieren?',
        message: 'Bist du sicher, dass du diese Daten importieren möchtest? Nicht gespeicherte Daten können nicht wieder hergestellt werden!',
        onConfirmClicked: () => {
          this.dataService.save(JSON.parse(fileContent));
          this.dialogService.isConfirmDialogVisible = false;
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
    const fileContent = JSON.stringify(this.dataService.getSavedData());

    // Erstelle ein Blob-Objekt mit dem Textinhalt und dem MIME-Typ
    const blob = new Blob([fileContent], { type: 'text/plain' });

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
      const fileContent = JSON.stringify(this.dataService.getSavedData());

      // Erstelle die Datei im ausgewählten Ordner
      const fileHandle = await handle.getFileHandle('meineDaten.txt', { create: true });
      const writableStream = await fileHandle.createWritable();

      // Schreibe den Inhalt in die Datei und schließe den Stream
      await writableStream.write(fileContent);
      await writableStream.close();

      console.log('Datei erfolgreich gespeichert.');
    } catch (error) {
      console.error('Fehler beim Speichern der Datei:', error);
    }
  }
}
