import {Component, Input, OnInit} from '@angular/core';
import {Day} from "../../../Models/Interfaces";
import {IBuchungenlistMonth} from "../../../Models/NewInterfaces";

@Component({
  selector: 'app-buchungen-list-month',
  templateUrl: './buchungen-list-month.component.html',
  styleUrl: './buchungen-list-month.component.css'
})
export class BuchungenListMonthComponent implements OnInit {
  @Input() month!: IBuchungenlistMonth;

  constructor() {

  }

  ngOnInit() {
    console.log(this.month)
  }

  getPresentAndPastDays() {
    const today = new Date();  // Hol das heutige Datum

    return this.month.days.filter(day => {
      const dayDate = day.date;
      return dayDate <= today;  // Vergleiche direkt das Datum
    });
  }
}
