import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SideNavService{

  selectedElement = SideNavElements.home;

  constructor() { }
}
