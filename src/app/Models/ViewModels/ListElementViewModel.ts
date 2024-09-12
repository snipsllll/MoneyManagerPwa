import {MenuItem} from "../Interfaces";

export interface ListElementViewModel{
  data: ListElementData;
  settings: ListElementSettings;
}

export interface ListElementData {
  betrag: number,
  title: string,
  zusatz?: string,
  details?: string,
  menuItems?: MenuItem[];
  detailsVisible?: boolean;
  id?: number;
}

export interface ListElementSettings {
  doMenuExist?: boolean;
  doDetailsExist?: boolean;
}
