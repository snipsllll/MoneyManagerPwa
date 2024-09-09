import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'MoneyManagerPwa';
  savedValue: string | null = null;  // Variable to hold the saved value

  ngOnInit(): void {
    // Check if the value exists in localStorage
    const valueFromStorage = localStorage.getItem('savedValue');

    if (valueFromStorage) {
      // If the value exists, assign it to the variable
      this.savedValue = valueFromStorage;
    } else {
      // If the value doesn't exist, set a default value and save it to localStorage
      localStorage.setItem('savedValue', this.savedValue ?? 'lol');
    }
  }

  onSaveValueChanged() {
    localStorage.setItem('savedValue', this.savedValue ?? 'lol');
  }

}
