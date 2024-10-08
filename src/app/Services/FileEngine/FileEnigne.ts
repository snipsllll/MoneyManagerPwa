import {environment} from "../../../environments/environment";
import {SavedData} from "../../Models/Interfaces";


export class FileEngine {

  fileName: string = 'savedText.txt';
  useTestData = 0;
  download: boolean;
  isInProduction = environment;

  constructor(useTestData: number, download: boolean) {
    this.useTestData = useTestData;
    this.download = download;
  }

  save(savedData: SavedData) {
    if(!this.isInProduction.production) {
      const blob = new Blob([JSON.stringify(savedData)], {type: 'text/plain'});
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.fileName;
      a.click();
      window.URL.revokeObjectURL(url);

      try {
        localStorage.setItem('savedText', JSON.stringify(savedData));
      } catch (e) {
        console.error('Fehler beim Speichern in localStorage:', e);
      }
    } else {
      localStorage.setItem('savedValue', JSON.stringify(savedData) ?? 'lol');
    }

  }

  load(): SavedData {
    if (this.useTestData !== 4) {
      return this.getTestData();
    } else {
      return this.getSavedData();
    }
  }

  private getSavedData() {
    return JSON.parse(this.loadTextFromLocalStorage(), (key, value) => {
      // Prüfen, ob der Wert ein ISO-8601 Datum ist
      if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
        return new Date(value); // Wenn ja, in ein Date-Objekt konvertieren
      }
      return value; // Ansonsten den Wert unverändert zurückgeben
    });
  }

  private loadTextFromLocalStorage(): string {
    try {
      let savedText: string | null;
      if(!this.isInProduction.production){
        savedText = localStorage.getItem('savedText');
      } else {
        savedText = localStorage.getItem('savedValue');
      }
      if (savedText) {
        return savedText;
      }
    } catch (e) {
      console.error('Fehler beim laden aus localStorage:', e);
    }
    return '{"buchungen":[],"savedMonths":[],"fixkosten":[]}';
  }

  private getTestData(): SavedData {
    const day1 = new Date();
    const day2 = new Date()
    const day3 = new Date()
    const day4 = new Date()
    const day5 = new Date()
    const day6 = new Date()
    const day7 = new Date()
    const day8 = new Date()
    const day9 = new Date()
    const day10 = new Date()
    day2.setDate(day1.getDate() - 1);
    day3.setDate(day1.getDate() - 2);
    day4.setDate(day1.getDate() - 3);
    day5.setDate(day1.getDate() - 4);
    day6.setDate(day1.getDate() - 5);
    day7.setDate(day1.getDate() - 6);
    day8.setDate(day1.getDate() - 7);
    day9.setDate(day1.getDate() - 8);
    day10.setDate(day1.getDate() - 31);
    switch (this.useTestData) {
      case 0:
        return {
          buchungen: [
            {
              date: new Date(),
              id: 1,
              title: 'test titel',
              betrag: 2,
              time: new Date().toLocaleTimeString(),
              beschreibung: 'testbeschreibung'
            }
          ],
          savedMonths: [
            {
              date: new Date(),
              sparen: 100,
              totalBudget: 400
            }
          ],
          fixKosten : [
            {
              title: 'Internet',
              betrag: 60,
              id: 1
            }
          ],
          sparEintraege : [
            {
              date: new Date(),
              id: 1,
              betrag: 20
            }
          ],
          wunschlistenEintraege: [
            {
              date: new Date(),
              id: 1,
              betrag: 80,
              title: 'Lego Bagger',
              zusatz: 'Bei kaufland im Angebot',
              gekauft: false,
              erstelltAm: new Date()
            }
          ]
        }
      case 1:
        return {
          buchungen: [
            {
              date: day1,
              id: 1,
              title: 'test titel',
              betrag: 2,
              time: '08:00',
              beschreibung: 'testbeschreibung'
            },
            {
              date: day1,
              id: 2,
              title: 'test titel 2',
              betrag: 5.5,
              time: '08:01',
              beschreibung: 'testbeschreibung 2'
            },
            {
              date: day2,
              id: 3,
              title: 'test titel 3',
              betrag: 12,
              time: '08:00',
              beschreibung: 'testbeschreibung 3'
            },
            {
              date: day2,
              id: 4,
              title: 'test titel 4',
              betrag: 2.98,
              time: '18:30',
              beschreibung: 'testbeschreibung 4'
            },
            {
              date: day3,
              id: 5,
              title: 'test titel 5',
              betrag: 21,
              time: '12:03',
              beschreibung: 'testbeschreibung 5'
            }
          ],
          savedMonths: [
            {
              date: new Date(),
              sparen: 100,
              totalBudget: 400
            }
          ],
          fixKosten : [
            {
              title: 'Internet',
              betrag: 60,
              id: 1
            }
          ],
          sparEintraege : [
            {
              date: new Date(),
              id: 1,
              betrag: 20
            },
            {
              date: new Date(),
              id: 2,
              betrag: 10
            }
          ],
          wunschlistenEintraege: [
            {
              date: new Date(),
              id: 1,
              betrag: 80,
              title: 'Lego Bagger',
              zusatz: 'Bei kaufland im Angebot',
              gekauft: false,
              erstelltAm: new Date()
            },
            {
              date: new Date(),
              id: 2,
              betrag: 120,
              title: 'Hängematte',
              zusatz: 'Amazon',
              gekauft: false,
              erstelltAm: new Date()
            }
          ]
        }
      case 2:
        return {
          buchungen: [
            {
              date: day1,
              id: 1,
              title: 'test titel',
              betrag: 2,
              time: '08:00',
              beschreibung: 'testbeschreibung'
            },
            {
              date: day1,
              id: 2,
              title: 'test titel 2',
              betrag: 5.5,
              time: '08:01',
              beschreibung: 'testbeschreibung 2'
            },
            {
              date: day1,
              id: 3,
              title: 'test titel 3',
              betrag: 1.56,
              time: '08:26',
              beschreibung: 'testbeschreibung 3'
            },
            {
              date: day1,
              id: 4,
              title: 'test titel 4',
              betrag: 2,
              time: '17:32',
              beschreibung: 'testbeschreibung 4'
            },
            {
              date: day2,
              id: 5,
              title: 'test titel 5',
              betrag: 12,
              time: '08:00',
              beschreibung: 'testbeschreibung 5'
            },
            {
              date: day2,
              id: 6,
              title: 'test titel 6',
              betrag: 2.98,
              time: '18:30',
              beschreibung: 'testbeschreibung 6'
            },
            {
              date: day3,
              id: 7,
              title: 'test titel 7',
              betrag: 21,
              time: '12:03',
              beschreibung: 'testbeschreibung 7'
            },
            {
              date: day10,
              id: 8,
              title: 'test titel 8',
              betrag: 2,
              time: '12:06',
              beschreibung: 'testbeschreibung 8'
            }
          ],
          savedMonths: [
            {
              date: new Date(),
              sparen: 100,
              totalBudget: 400
            }
          ],
          fixKosten : [
            {
              title: 'Internet',
              betrag: 60,
              id: 1
            },
            {
              title: 'Medis',
              betrag: 20,
              id: 2
            },
            {
              title: 'Netflix',
              betrag: 14,
              id: 3
            },
            {
              title: 'DE-Ticket',
              betrag: 49,
              id: 4,
              zusatz: 'ztuioezfcuisonchofg'
            }
          ],
          sparEintraege : [
            {
              date: new Date(),
              id: 1,
              betrag: 10
            },
            {
              date: new Date(),
              id: 2,
              betrag: 20
            },
            {
              date: new Date(),
              id: 3,
              betrag: 30
            },
            {
              date: new Date(),
              id: 4,
              betrag: 40
            },
            {
              date: new Date(),
              id: 5,
              betrag: 50
            }
          ],
          wunschlistenEintraege: [
            {
              date: new Date(),
              id: 1,
              betrag: 80,
              title: 'Lego Bagger',
              zusatz: 'Bei kaufland im Angebot',
              gekauft: false,
              erstelltAm: new Date()
            },
            {
              date: new Date(),
              id: 2,
              betrag: 120,
              title: 'Hängematte',
              zusatz: 'Amazon',
              gekauft: false,
              erstelltAm: new Date()
            },{
              date: new Date(),
              id: 3,
              betrag: 20,
              title: 'Bowling',
              zusatz: 'In der Libori-Galerie',
              gekauft: true,
              erstelltAm: new Date()
            },
            {
              date: new Date(),
              id: 4,
              betrag: 120,
              title: 'Laptop',
              zusatz: 'Amazon',
              gekauft: true,
              gekauftAm: new Date(),
              erstelltAm: new Date()
            },{
              date: new Date(),
              id: 5,
              betrag: 300,
              title: 'E-Scooter',
              gekauft: false,
              erstelltAm: new Date()
            }
          ]
        }
      case 3:
        return {
          buchungen: [],
          savedMonths: [],
          fixKosten: [],
          sparEintraege: [],
          wunschlistenEintraege: []
        };
    }
    return {
      buchungen: [],
      savedMonths: [],
      fixKosten: [],
      sparEintraege: [],
      wunschlistenEintraege: []
    }
  }
}
