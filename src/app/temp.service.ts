import { Injectable } from '@angular/core';
import {ISavedLoginData} from "./Models/ISavedLoginData";

@Injectable({
  providedIn: 'root'
})
export class TempService {

  dataUsedForRegister?: ISavedLoginData;

  constructor() { }
}
