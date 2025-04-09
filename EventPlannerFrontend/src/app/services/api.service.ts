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
}
