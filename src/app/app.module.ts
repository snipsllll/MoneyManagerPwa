import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import {FormsModule} from "@angular/forms";
import {TestComponentComponent} from "./Components/test-component/test-component.component";
import {HomeComponent} from "./Components/home/home.component";
import {BuchungenListDayComponent} from "./Components/buchungen-list-day/buchungen-list-day.component";
import {DayComponent} from "./Components/day/day.component";
import {BudgetComponent} from "./Components/budget/budget.component";
import {ConfirmDialogComponent} from "./Components/confirm-dialog/confirm-dialog.component";
import {CreateBuchungComponent} from "./Components/create-buchung/create-buchung.component";
import {EditBuchungComponent} from "./Components/edit-buchung/edit-buchung.component";
import {FixKostenComponent} from "./Components/fix-kosten/fix-kosten.component";
import {
  FixKostenEintragListelemComponent
} from "./Components/fix-kosten-eintrag-listelem/fix-kosten-eintrag-listelem.component";
import {BuchungListelemComponent} from "./Components/buchung-listelem/buchung-listelem.component";
import {BuchungenListComponent} from "./Components/buchungen-list/buchungen-list.component";
import {SideNavComponent} from "./Components/side-nav/side-nav.component";
import {TopBarComponent} from "./Components/top-bar/top-bar.component";
import {BuchungDetailsComponent} from "./Components/buchung-details/buchung-details.component";

@NgModule({
  declarations: [
    AppComponent,
    TestComponentComponent,
    HomeComponent,
    BuchungenListDayComponent,
    DayComponent,
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
    BuchungDetailsComponent
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
