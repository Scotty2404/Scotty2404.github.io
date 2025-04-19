import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Survey } from '../models/survey.model';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  eventList = [
    { eventName: 'Fabis Geburtstag', eventTitle: '22.03.2026 um 18:30 Uhr', eventInfo: 'Hier kann etwas ganz Langes hin, wo man feiert, oder andere Infos, so viel wie man will' },
    { eventName: 'Ellis Hochzeit', eventTitle: '04.07.2026 um 12:00 Uhr', eventInfo: 'Auch hier kann man eine ganz lange Info hinschreiben, egal was. Einfach wann es losgeht, wo und irgendwelche weiteren Details' },
    { eventName: 'Patricias Jugendweihe', eventTitle: '25.05.2026 um 15:00 Uhr', eventInfo: 'Auch etwas Kurzes kann hier hin, klappt alles' },
  ];

  guestList = [
    { firstname: 'Hans', lastname: 'Müller', mail: 'hans.mueller@example.com', info: 'Hallo', commitment: 'yes' },
    { firstname: 'Lisa', lastname: 'Schmidt', mail: 'lisa.schmidt@example.com', info: 'Hi', commitment: 'no' },
    { firstname: 'Peter', lastname: 'Meier', mail: 'peter.meier@example.com', info: 'Test', commitment: 'maybe' }
  ];

  // Definiere die surveyList mit dem entsprechenden Typ
  surveyList: Survey[] = []; // Array von Umfragen

  constructor() { }

  getEventList() {
    return this.eventList;
  }

  getGuestList() {
    return this.guestList;
  }

  addGuest(guest: any) {
    this.guestList.push(guest);
  }

  // Neue Methoden für Umfragen
  getSurveyList(): Observable<Survey[]> {
    return of(this.surveyList); // Gibt ein Observable von Survey[] zurück
  }

  addSurvey(survey: Survey) {
    this.surveyList.push(survey);
  }
}