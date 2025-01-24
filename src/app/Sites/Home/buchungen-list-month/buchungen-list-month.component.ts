import {Component, Input, OnInit, signal} from '@angular/core';
import {IBuchungenlistMonth} from "../../../Models/NewInterfaces";

@Component({
  selector: 'app-buchungen-list-month',
  templateUrl: './buchungen-list-month.component.html',
  styleUrl: './buchungen-list-month.component.css'
})
export class BuchungenListMonthComponent implements OnInit {
  @Input() month!: IBuchungenlistMonth;

  isMonthVisible = signal<boolean>(false);

  constructor() {

  }

  ngOnInit() {
    console.log(this.month)
    this.isMonthVisible.set(this.month.isVisible);
  }

  toggleIsMonthVisible() {
    this.isMonthVisible.set(!this.isMonthVisible());
  }

  onShowMonthClicked() {
    this.isMonthVisible.set(true);
  }

  onHideMonthClicked() {
    this.isMonthVisible.set(false);
  }
}
