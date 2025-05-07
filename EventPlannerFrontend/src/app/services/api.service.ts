import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, userData);
  }

  login(loginData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, loginData);
  }

  logout(): void {
    // Clear the authentication token from localStorage
    localStorage.removeItem('token');
  }

  getUser():Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  createEvent(eventData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/events/create`, eventData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  editEvent(eventData: any, eventId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/events/my-events/${eventId}/edit`, eventData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  deleteEvent(eventId: string) {
    return this.http.delete(`${this.baseUrl}/events/my-events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getEvents(): Observable<any> {
    return this.http.get(`${this.baseUrl}/events/my-events`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getInvitedEventsForUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/events/my-events/invited`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getEventById(eventId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/events/my-events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getGuestsForEvent(eventId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/events/${eventId}/guests`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  addGuestToEvent(guestData: any, eventId: string): Observable<any> {
    console.log('adding guest: ', guestData);
    return this.http.post(`${this.baseUrl}/events/${eventId}/guests/add`, guestData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  getPublicEvent(eventId: string, token: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/events/public-event/${eventId}?token=${token}`);
  }

  getEventFromQrCode(eventId: string, token: string) {
    return this.http.get(`${this.baseUrl}/events/public-event/${eventId}`, {
      params: {
        token: token
      }
    });
  }

  getEventSurveys(eventId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/events/${eventId}/surveys`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  // Get a specific survey by ID
  getSurvey(surveyId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/surveys/${surveyId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  // Get survey results
  getSurveyResults(surveyId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/surveys/${surveyId}/results`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  // Submit survey response
  submitSurveyResponse(surveyId: string, answers: any): Observable<any> {
    const formattedAnswers = answers;
  
    return this.http.post(`${this.baseUrl}/surveys/${surveyId}/response`,
      { answers },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    ).pipe(
      catchError((error) => {
        console.error('Error submitting survey:', error);
  
        let errorMessage = 'Fehler beim Senden der Umfrage';
        if (error.error?.message) {
          errorMessage += ': ' + error.error.message;
        } else if (error.message) {
          errorMessage += ': ' + error.message;
        }
  
        console.log('Survey submission failed with answers:', formattedAnswers);
  
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  // Create a new survey
  createSurvey(surveyData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/surveys/create`, surveyData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  completeSurvey(surveyId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/surveys/${surveyId}/complete`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
  
  // In api.service.ts:
  updateEventSurvey(eventId: string, surveyId: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/events/my-events/${eventId}/update-survey`, 
      { survey_id: surveyId }, 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }
}
