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
import {
  FixKostenEintragListelemComponent
} from "./Sites/Fixkosten/fix-kosten-eintrag-listelem/fix-kosten-eintrag-listelem.component";
import {BuchungListelemComponent} from "./Sites/Home/buchung-listelem/buchung-listelem.component";
import {BuchungenListComponent} from "./Sites/Home/buchungen-list/buchungen-list.component";
import {SideNavComponent} from "./SharedComponents/side-nav/side-nav.component";
import {TopBarComponent} from "./SharedComponents/top-bar/top-bar.component";
import {BuchungDetailsComponent} from "./SharedComponents/buchung-details/buchung-details.component";
import {SparschweinComponent} from "./Sites/Sparschwein/sparschwein/sparschwein.component";
import {SparschweinListelemComponent} from "./Sites/Sparschwein/sparschwein-listelem/sparschwein-listelem.component";
import {ListElementComponent} from "./SharedComponents/list-element/list-element.component";
import {EditDialogComponent} from "./SharedComponents/edit-dialog/edit-dialog.component";
import {CreateDialogComponent} from "./SharedComponents/create-dialog/create-dialog.component";

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
    FixKostenEintragListelemComponent,
    BuchungListelemComponent,
    BuchungenListComponent,
    SideNavComponent,
    TopBarComponent,
    BuchungDetailsComponent,
    SparschweinComponent,
    SparschweinListelemComponent,
    ListElementComponent,
    EditDialogComponent,
    CreateDialogComponent
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
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
