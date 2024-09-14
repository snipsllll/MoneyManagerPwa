import {Component, OnInit, ViewChild} from '@angular/core';
import {TopbarService} from "../../../Services/TopBarService/topbar.service";
import {DataService} from "../../../Services/DataService/data.service";

@Component({
  selector: 'app-einstellungen',
  templateUrl: './einstellungen.component.html',
  styleUrl: './einstellungen.component.css'
})
export class EinstellungenComponent implements OnInit{

  @ViewChild('fileInput') fileInput: any;

  constructor(private topbarService: TopbarService, private dataService: DataService) {
  }

  ngOnInit() {
    this.topbarService.title.set('EINSTELLUNGEN');
    this.topbarService.dropDownSlidIn.set(false);
    this.topbarService.isDropDownDisabled = true;
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
      this.dataService.save(JSON.parse(fileContent));
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

}
