import {Component, OnInit} from '@angular/core';
import {FileServiceService} from "./services/fileService/file-service.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'MoneyManagerPwa';
  savedValue: string | null = null;  // Variable to hold the saved value

  constructor(private fileService: FileServiceService) {

  }

  ngOnInit(): void {
    // Check if the value exists in localStorage
    const valueFromStorage = this.fileService.load();

    if (valueFromStorage) {
      // If the value exists, assign it to the variable
      this.savedValue = valueFromStorage;
    } else {
      // If the value doesn't exist, set a default value and save it to localStorage
      this.fileService.save(this.savedValue ?? '');
    }
  }

  onSaveValueChanged() {
    this.fileService.save(this.savedValue ?? '')
  }

}
