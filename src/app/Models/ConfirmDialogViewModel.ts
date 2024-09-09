export interface ConfirmDialogViewModel {
  title: string;
  message: string;
  onConfirmClicked: () => void;
  onCancelClicked: () => void;
}
