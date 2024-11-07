export class UT {
  public toFixedDown(number?: number, decimals?: number): number | undefined {
    if(number === undefined || decimals === undefined) {
      return undefined;
    }
    const numberString = number.toString();

    // Wenn keine Dezimalstelle vorhanden ist, direkt zurückgeben
    if (!numberString.includes(".")) {
      return +(number.toFixed(decimals));
    }

    const [numberVorKomma, numberNachKommaOriginal] = numberString.split(".");
    let numberNachKomma = numberNachKommaOriginal.substring(0, decimals);

    // Fehlende Dezimalstellen auffüllen, falls erforderlich
    while (numberNachKomma.length < decimals) {
      numberNachKomma += "0";
    }

    // Rückgabewert zusammenstellen
    return +(numberVorKomma + "." + numberNachKomma);
  }
}
