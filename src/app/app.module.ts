import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import {FormsModule} from "@angular/forms";
import {HomeComponent} from "./Sites/Home/home/home.component";
import {BuchungenListDayComponent} from "./Sites/Home/buchungen-list-day/buchungen-list-day.component";
import {BudgetComponent} from "./Sites/Budget/budget/budget.component";
import {ConfirmDialogComponent} from "./SharedComponents/confirm-dialog/confirm-dialog.component";
import {CreateBuchungComponent} from "./SharedComponents/create-buchung/create-buchung.component";
import {EditBuchungComponent} from "./SharedComponents/edit-buchung/edit-buchung.component";
import {FixKostenComponent} from "./Sites/Fixkosten/fix-kosten/fix-kosten.component";
import {BuchungListelemComponent} from "./Sites/Home/buchung-listelem/buchung-listelem.component";
import {BuchungenListComponent} from "./Sites/Home/buchungen-list/buchungen-list.component";
import {SideNavComponent} from "./SharedComponents/side-nav/side-nav.component";
import {TopBarComponent} from "./SharedComponents/top-bar/top-bar.component";
import {BuchungDetailsComponent} from "./SharedComponents/buchung-details/buchung-details.component";
import {SparschweinComponent} from "./Sites/Sparschwein/sparschwein/sparschwein.component";
import {ListElementComponent} from "./SharedComponents/list-element/list-element.component";
import {EditDialogComponent} from "./SharedComponents/edit-dialog/edit-dialog.component";
import {CreateDialogComponent} from "./SharedComponents/create-dialog/create-dialog.component";
import {WunschlisteComponent} from "./Sites/Wunschliste/wunschliste/wunschliste.component";
import {SpinningFishComponent} from "./Sites/SpinningFish/spinning-fish/spinning-fish.component";
import { EinstellungenComponent } from './Sites/Einstellungen/einstellungen/einstellungen.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { SearchboxComponent } from './SharedComponents/Searchbox/searchbox/searchbox.component';
import { MonatFixkostenDialogComponent } from './SharedComponents/monat-fixkosten-dialog/monat-fixkosten-dialog/monat-fixkosten-dialog.component';
import { BuchungskategorienDialogComponent } from './SharedComponents/buchungskategorien-dialog/buchungskategorien-dialog.component';
import { BarChartComponent } from './SharedComponents/bar-chart/bar-chart.component';
import { AuswertungenComponent } from './Sites/auswertungen/auswertungen.component';
import { AuswertungenDialogComponent } from './SharedComponents/auswertungen-dialog/auswertungen-dialog.component';
import { CreateAuswertungsLayoutDialogComponent } from './SharedComponents/create-auswertungs-layout-dialog/create-auswertungs-layout-dialog.component';
import { DiagramDetailsComponent } from "./SharedComponents/diagram-details/diagram-details.component";
import { MmBarChartComponent } from './SharedComponents/mm-bar-chart/mm-bar-chart.component';
import { PlusButtonComponent } from './SharedComponents/plus-button/plus-button.component';
import { LoginComponent } from './Sites/login/login.component';
import { RegisterComponent } from './Sites/register/register.component';
import {AngularFireModule} from "@angular/fire/compat";
import {AngularFireAuthModule} from "@angular/fire/compat/auth";
import {AngularFirestoreModule} from "@angular/fire/compat/firestore";
import { NotificationPopupComponent } from './SharedComponents/notification-popup/notification-popup.component';
import { PasswortResetComponent } from './Sites/login/passwort-reset/passwort-reset.component';
import { InfoBoxComponent } from './SharedComponents/info-box/info-box.component';

const firebaseConfig = {
  apiKey: "AIzaSyDsIabaMBr-3DJD6dNPaWpuI_IWD-B5J7U",
  authDomain: "ttt3-ca832.firebaseapp.com",
  projectId: "ttt3-ca832",
  storageBucket: "ttt3-ca832.firebasestorage.app",
  messagingSenderId: "531026768134",
  appId: "1:531026768134:web:54b164a6f7cb0731e52e87"
};

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        BuchungenListDayComponent,
        BudgetComponent,
        ConfirmDialogComponent,
        CreateBuchungComponent,
        EditBuchungComponent,
        FixKostenComponent,
        BuchungListelemComponent,
        BuchungenListComponent,
        SideNavComponent,
        TopBarComponent,
        BuchungDetailsComponent,
        SparschweinComponent,
        ListElementComponent,
        EditDialogComponent,
        CreateDialogComponent,
        WunschlisteComponent,
        SpinningFishComponent,
        EinstellungenComponent,
        SearchboxComponent,
        MonatFixkostenDialogComponent,
        BuchungskategorienDialogComponent,
        BarChartComponent,
        AuswertungenComponent,
        AuswertungenDialogComponent,
        CreateAuswertungsLayoutDialogComponent,
        DiagramDetailsComponent,
        DiagramDetailsComponent,
        MmBarChartComponent,
        PlusButtonComponent,
        LoginComponent,
        RegisterComponent,
        NotificationPopupComponent,
        PasswortResetComponent,
        InfoBoxComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
        FormsModule,
        AngularFireModule.initializeApp(firebaseConfig), // Initialisiere Firebase
        AngularFireAuthModule, // Authentifizierung Modul
        AngularFirestoreModule, // Firebase Realtime Database Modul
    ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
