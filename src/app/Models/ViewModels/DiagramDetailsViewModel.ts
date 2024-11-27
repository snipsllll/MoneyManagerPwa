import {BarChartFilterOptions, BarChartValueOptions, XAchsenSkalierungsOptionen} from "../Enums";

export interface DiagramDetailsViewModel {
  id?: number;
  title?: string;
  wert?: BarChartValueOptions;
  filter: {
    filter?: any,
    value?: any;
  };
  xAchse?: XAchsenSkalierungsOptionen;
  color?: string;
}
