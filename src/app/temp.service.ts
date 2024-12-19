import { Injectable } from '@angular/core';
import {ISavedLoginData} from "./Models/ISavedLoginData";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TempService {

  dataUsedForRegister?: ISavedLoginData;
  isTryingAutoLogin = new BehaviorSubject<boolean>(false);
  autoLoginError = new BehaviorSubject<any | undefined>(undefined);

  constructor() { }
}
