import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TestComponentComponent} from "./test-component/test-component.component";

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route
  { path: 'test', component: TestComponentComponent },           // Home route
  { path: '**', redirectTo: '/home' }                   // Wildcard route for 404 page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
