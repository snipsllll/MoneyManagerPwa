import {MenuItem} from "../Interfaces";
import {Color} from "../Enums";

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
  date?: Date;
  erstelltAm?: Date;
  vonHeuteAbziehen?: boolean;
}

export interface ListElementSettings {
  doMenuExist?: boolean;
  doDetailsExist?: boolean;
  highlighted?: boolean;
  betragColor?: Color;
  isDarker?: boolean;
  isGrayedOut?: boolean;
}
