import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  getEventById(eventId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/events/my-events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }

  createSurvey(surveyData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/events/survey/create`, surveyData, {
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

  getEventFromQrCode(eventId: string, token: string) {
    return this.http.get(`${this.baseUrl}/events/public-event/${eventId}`, {
      params: {
        token: token
      }
    });
  }
}
