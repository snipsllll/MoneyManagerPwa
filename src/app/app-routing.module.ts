import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./Components/home/home.component";
import {EditBuchungComponent} from "./Components/edit-buchung/edit-buchung.component";
import {CreateBuchungComponent} from "./Components/create-buchung/create-buchung.component";
import {BudgetComponent} from "./Components/budget/budget.component";
import {FixKostenComponent} from "./Components/fix-kosten/fix-kosten.component";
import {BuchungDetailsComponent} from "./Components/buchung-details/buchung-details.component";
import {SparschweinComponent} from "./Components/sparschwein/sparschwein.component";

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'buchungDetails/:buchungsId', component: BuchungDetailsComponent},
  {path: 'editBuchung/:buchungsId', component: EditBuchungComponent},
  {path: 'createBuchung', component: CreateBuchungComponent},
  {path: 'budget', component: BudgetComponent},
  {path: 'fixKosten', component: FixKostenComponent},
  {path: 'sparschwein', component: SparschweinComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
