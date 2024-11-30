export interface DiagramDetailsViewModel {
  id?: number;
  title?: string;
  wert?: string;
  filter: {
    filter?: any,
    value?: any;
  };
  xAchse?: string;
  color?: string;
  showHorizontaleLinie?: boolean;
  horizontaleLinie?: string;
  horizontaleLinieZahl?: number;
}
