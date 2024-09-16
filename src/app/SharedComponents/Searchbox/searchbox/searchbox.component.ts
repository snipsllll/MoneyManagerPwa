import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrl: './searchbox.component.css'
})
export class SearchboxComponent {
  // Das zu filternde Array wird von außen als Input übergeben
  @Input() items: any[] = [];

  // Der Name des Feldes, nach dem gefiltert wird (z.B. "titel")
  @Input() filterField: string = '';

  // EventEmitter, um das geklickte Element nach außen zu senden
  @Output() itemSelected = new EventEmitter<any>();

  // Suchbegriff
  suchbegriff: string = '';

  // Methode zum Filtern der Items nach dem gegebenen Feld
  get gefilterteItems() {
    return this.items.filter(item =>
      item[this.filterField]?.toLowerCase().includes(this.suchbegriff.toLowerCase())
    );
  }

  // Methode, um das geklickte Element auszugeben
  eintragAuswaehlen(item: any) {
    this.itemSelected.emit(item);
  }
}
