import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {DialogService} from "./Services/DialogService/dialog.service";
import {environment} from "../environments/environment";
import {SwUpdate} from "@angular/service-worker";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DataService} from "./Services/DataService/data.service";
import {BarChartViewModel} from "./Models/NewInterfaces";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'Moma';
  inProduction = environment.production
  testArray = [
    { titel: 'Tasche', betrag: 12 },
    { titel: 'Bagger', betrag: 50 },
    { titel: 'Ball', betrag: 10 }
  ];

  test(event: Event) {
    console.log(event)
  }

  constructor(private swUpdate: SwUpdate, private snackBar: MatSnackBar, private router: Router, public dialogService: DialogService, private dataService: DataService) {

  }

  ngOnInit() {
    if(this.inProduction)
    this.router.navigate(['/'])

    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_READY') {
          // Zeige die Snackbar oben am Bildschirm an
          const snackBarRef = this.snackBar.open('Eine neue Version ist verfügbar!', 'Aktualisieren', {
            duration: 6000,
            verticalPosition: 'top',  // Zeigt die Snackbar oben an
            horizontalPosition: 'center' // Optional: Snackbar mittig horizontal ausrichten
          });

          // Falls der Benutzer auf 'Aktualisieren' klickt, aktualisiere die App
          snackBarRef.onAction().subscribe(() => {
            this.activateUpdate();
          });
        }
      });
    }
  }

  private activateUpdate(): void {
    this.swUpdate.activateUpdate().then(() => {
      // Lade die Seite neu, um die neue Version zu aktivieren
      document.location.reload();
    });
  }

}
