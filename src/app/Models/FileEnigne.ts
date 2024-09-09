import {SavedData} from "./ClassesInterfacesEnums";

export class FileEngine {

  fileName: string = 'savedText.txt';
  useTestData = 0;
  download: boolean;

  constructor(useTestData: number, download: boolean) {
    this.useTestData = useTestData;
    this.download = download;
  }

  save(savedData: SavedData) {
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
  }

  load(): SavedData {
    if (this.useTestData !== 3) {
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
      const savedText = localStorage.getItem('savedText');
      if (savedText) {
        return savedText;
      }
    } catch (e) {
      console.error('Fehler beim laden aus localStorage:', e);
    }
    return '{"buchungen":[],"savedMonths":[]}';
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
              beschreibung: 'ztuioezfcuisonchofg'
            }
          ]
        }
    }
    return {
      buchungen: [],
      savedMonths: [],
      fixKosten: []
    }
  }
}
