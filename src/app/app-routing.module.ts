import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {BuchungDetailsComponent} from "./SharedComponents/buchung-details/buchung-details.component";
import {HomeComponent} from "./Sites/Home/home/home.component";
import {EditBuchungComponent} from "./SharedComponents/edit-buchung/edit-buchung.component";
import {CreateBuchungComponent} from "./SharedComponents/create-buchung/create-buchung.component";
import {BudgetComponent} from "./Sites/Budget/budget/budget.component";
import {FixKostenComponent} from "./Sites/Fixkosten/fix-kosten/fix-kosten.component";
import {SparschweinComponent} from "./Sites/Sparschwein/sparschwein/sparschwein.component";
import {WunschlisteComponent} from "./Sites/Wunschliste/wunschliste/wunschliste.component";
import {SpinningFishComponent} from "./Sites/SpinningFish/spinning-fish/spinning-fish.component";
import {EinstellungenComponent} from "./Sites/Einstellungen/einstellungen/einstellungen.component";
import {AuswertungenComponent} from "./Sites/auswertungen/auswertungen.component";
import {LoginComponent} from "./Sites/login/login.component";
import {RegisterComponent} from "./Sites/register/register.component";
import {PasswortResetComponent} from "./Sites/login/passwort-reset/passwort-reset.component";

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'login', redirectTo: ''},
  {path: 'register', component: RegisterComponent},
  {path: 'home', component: HomeComponent},
  {path: 'buchungDetails/:buchungsId/:geplanteAusgabenBuchungsId', component: BuchungDetailsComponent},
  {path: 'editBuchung/:buchungsId/:geplanteAusgabenBuchungsId', component: EditBuchungComponent},
  {path: 'createBuchung', component: CreateBuchungComponent},
  {path: 'budget', component: BudgetComponent},
  {path: 'fixKosten', component: FixKostenComponent},
  {path: 'sparschwein', component: SparschweinComponent},
  {path: 'wunschliste', component: WunschlisteComponent},
  {path: 'spinning-fish', component: SpinningFishComponent},
  {path: 'auswertungen', component: AuswertungenComponent},
  {path: 'einstellungen', component: EinstellungenComponent},
  {path: 'resetPassword', component: PasswortResetComponent},
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
