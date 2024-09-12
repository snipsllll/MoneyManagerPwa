import {Component, Input, signal} from '@angular/core';
import {ListElementViewModel} from "../../Models/ViewModels/ListElementViewModel";

@Component({
  selector: 'app-list-element',
  templateUrl: './list-element.component.html',
  styleUrl: './list-element.component.css'
})
export class ListElementComponent {

  @Input() viewModel!: ListElementViewModel;
  isMenuVisible = signal<boolean>(false);

  onMenuClicked() {
    this.isMenuVisible.set(!this.isMenuVisible());
  }

  onMenuEintragClicked(f: () => void) {
    this.isMenuVisible.set(false);
    f();
  }
}
