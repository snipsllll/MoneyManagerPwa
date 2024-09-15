import {Injectable} from '@angular/core';
import {SideNavElements} from "../../Models/Enums";
import {ActivatedRoute} from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class SideNavService{

  selectedElement = SideNavElements.home;

  constructor(private route : ActivatedRoute) { }
}
