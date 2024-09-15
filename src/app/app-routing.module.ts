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

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'buchungDetails/:buchungsId', component: BuchungDetailsComponent},
  {path: 'editBuchung/:buchungsId', component: EditBuchungComponent},
  {path: 'createBuchung', component: CreateBuchungComponent},
  {path: 'budget', component: BudgetComponent},
  {path: 'fixKosten', component: FixKostenComponent},
  {path: 'sparschwein', component: SparschweinComponent},
  {path: 'wunschliste', component: WunschlisteComponent},
  {path: 'spinning-fish', component: SpinningFishComponent},
  {path: 'einstellungen', component: EinstellungenComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
