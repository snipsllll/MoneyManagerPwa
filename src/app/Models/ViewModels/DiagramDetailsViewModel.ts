import {BarChartFilterOptions, BarChartValueOptions, XAchsenSkalierungsOptionen} from "../Enums";

export interface DiagramDetailsViewModel {
  id?: number;
  title?: string;
  wert?: BarChartValueOptions;
  filter?: BarChartFilterOptions;
  xAchse?: XAchsenSkalierungsOptionen;
  color?: string;
}
