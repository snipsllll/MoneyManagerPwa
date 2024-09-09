import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileServiceService {

  constructor() { }

  save(savedValue: string) {
    localStorage.setItem('savedValue', savedValue ?? 'lol');
  }

  load() {
    return localStorage.getItem('savedValue');
  }
}
