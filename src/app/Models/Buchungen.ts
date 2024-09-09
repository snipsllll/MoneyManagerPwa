export class Buchungen {

  public alleBuchungen: Buchung[];

  constructor(alleBuchungen?: Buchung[]){
    this.alleBuchungen = alleBuchungen ?? [];
  }

}
