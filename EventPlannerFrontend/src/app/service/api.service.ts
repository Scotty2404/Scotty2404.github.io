import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:5000/api'; // Backend-URL

  constructor(private http: HttpClient) { }

  //Authentification
  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  //EventManagement
  createEvent(event: any, token:string): Observable<any>{
    return this.http.post(`${this.apiUrl}/events/create`, event, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}`})
    });
  }

  getMyEvents(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/events/my-events`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    });
  }

  getEventGuests(eventId: string, token: string):Observable<any> {
    return this.http.get(`${this.apiUrl}/events/${eventId}/guests`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    });
  }

  respondToEvent(eventId: string, response: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/events/respond/${eventId}`, response);
  }
}
