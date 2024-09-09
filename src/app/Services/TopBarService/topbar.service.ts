import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class TopbarService {
  title = signal<string>('');
  isSlidIn = signal<boolean>(false);
  dropDownSlidIn = signal<boolean>(false);
  isDropDownDisabled = false;

  constructor() { }
}
