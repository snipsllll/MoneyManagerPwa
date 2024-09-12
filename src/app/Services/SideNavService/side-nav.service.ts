import { Injectable } from '@angular/core';
import {SideNavElements} from "../../Models/ClassesInterfacesEnums";

@Injectable({
  providedIn: 'root'
})

export class SideNavService{

  selectedElement = SideNavElements.home;

  constructor() { }
}
