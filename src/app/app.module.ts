import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import {FormsModule} from "@angular/forms";
import { TestComponentComponent } from './test-component/test-component.component';
import { HomeComponent } from './home/home.component';
import { BuchungenListDayComponent } from './buchungen-list-day/buchungen-list-day.component';
import { DayComponent } from './day/day.component';
import { BudgetComponent } from './budget/budget.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { CreateBuchungComponent } from './create-buchung/create-buchung.component';
import { EditBuchungComponent } from './edit-buchung/edit-buchung.component';
import { FixKostenComponent } from './fix-kosten/fix-kosten.component';
import { FixKostenEintragListelemComponent } from './fix-kosten-eintrag-listelem/fix-kosten-eintrag-listelem.component';
import { BuchungListelemComponent } from './buchung-listelem/buchung-listelem.component';
import { BuchungenListComponent } from './buchungen-list/buchungen-list.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { TopBarComponent } from './top-bar/top-bar.component';

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
    TopBarComponent
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
