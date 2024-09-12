import { Injectable } from '@angular/core';
import {SideNavElements} from "../../Models/Enums";

@Injectable({
  providedIn: 'root'
})

export class SideNavService{

  selectedElement = SideNavElements.home;

  constructor() { }
}
