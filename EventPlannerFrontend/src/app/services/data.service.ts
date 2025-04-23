import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Survey } from '../models/survey.model';

// Mit @Injectable wird dieser Service überall in der App nutzbar gemacht.
// 'providedIn: root' sorgt dafür, dass er als Singleton bereitgestellt wird.
@Injectable({
  providedIn: 'root'
})
export class DataService {

  // Statische Liste von Events mit Dummy-Daten
  eventList = [
    {
      eventName: 'Fabis Geburtstag',
      eventTitle: '22.03.2026 um 18:30 Uhr',
      eventInfo: 'Hier kann etwas ganz Langes hin, wo man feiert, oder andere Infos, so viel wie man will'
    },
    {
      eventName: 'Ellis Hochzeit',
      eventTitle: '04.07.2026 um 12:00 Uhr',
      eventInfo: 'Auch hier kann man eine ganz lange Info hinschreiben, egal was. Einfach wann es losgeht, wo und irgendwelche weiteren Details'
    },
    {
      eventName: 'Patricias Jugendweihe',
      eventTitle: '25.05.2026 um 15:00 Uhr',
      eventInfo: 'Auch etwas Kurzes kann hier hin, klappt alles'
    }
  ];

  // Statische Gästeliste mit Testeinträgen
  guestList = [
    {
      firstname: 'Hans',
      lastname: 'Müller',
      mail: 'hans.mueller@example.com',
      info: 'Hallo',
      commitment: 'yes'
    },
    {
      firstname: 'Lisa',
      lastname: 'Schmidt',
      mail: 'lisa.schmidt@example.com',
      info: 'Hi',
      commitment: 'no'
    },
    {
      firstname: 'Peter',
      lastname: 'Meier',
      mail: 'peter.meier@example.com',
      info: 'Test',
      commitment: 'maybe'
    }
  ];

  // Umfragenliste, die initial leer ist (kann später dynamisch befüllt werden)
  surveyList: Survey[] = [];

  constructor() { }

  // Gibt die aktuelle Liste der Events zurück
  getEventList() {
    return this.eventList;
  }

  // Gibt die aktuelle Gästeliste zurück
  getGuestList() {
    return this.guestList;
  }

  // Fügt einen neuen Gast der Liste hinzu
  addGuest(guest: any) {
    this.guestList.push(guest);
  }

  // Gibt die aktuelle Liste aller Umfragen als Observable zurück
  getSurveyList(): Observable<Survey[]> {
    return of(this.surveyList);
  }

  // Fügt eine neue Umfrage der Umfragenliste hinzu
  addSurvey(survey: Survey) {
    this.surveyList.push(survey);
  }

  // Liefert ein simuliertes Ergebnis für eine Umfrage zurück
  getSurveyResult(survey: Survey): Observable<Survey> {
    // Es wird eine Kopie der Umfrage erstellt und der Status auf "completed" gesetzt
    const resultSurvey: Survey = {
      ...survey,
      status: 'completed',
      questions: survey.questions.map(q => {
        // Wenn es eine Checkbox-Frage ist, generiere zufällige Prozentsätze für die Antwortoptionen
        if (q.answerType === 'checkbox' && q.options) {
          const optionPercentages = q.options.map(() => Math.floor(Math.random() * 100));
          return {
            ...q,
            optionPercentages
          };
        }
        // Bei Skalenfragen wird ein zufälliger Skalenwert und eine Antwortquote generiert
        else if (q.answerType === 'scale') {
          return {
            ...q,
            scaleValue: Math.floor(Math.random() * 10),
            answerPercentage: Math.floor(Math.random() * 100)
          };
        }
        // Bei offenen Fragen bleibt alles unverändert (keine Auswertung)
        else {
          return q;
        }
      })
    };

    // Das Ergebnis wird als Observable zurückgegeben
    return of(resultSurvey);
  }
}