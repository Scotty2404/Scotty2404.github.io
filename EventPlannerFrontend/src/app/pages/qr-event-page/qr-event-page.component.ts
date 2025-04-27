import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-qr-event-page',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatCardModule,
    RouterLink
  ],
  templateUrl: './qr-event-page.component.html',
  styleUrl: './qr-event-page.component.scss'
})
export class QrEventPageComponent implements OnInit {
  attending: 'yes' | 'no' | null = null;
  surveyAvailable = false;
  surveyId: string | null = null;
  responseSubmitted = false;
  responseMessage = '';

  guest = {
    firstname: '',
    lastname: '',
    mail: '',
    info: '',
    password: ''
  };

  event = {
    title: '',
    date: '',
    image: '',
    street: '',
    zip: '',
    city: '',
    info: ''
  };

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Hole Event-ID und Token aus der URL
    this.route.params.subscribe(params => {
      const eventId = params['id'];
      this.route.queryParams.subscribe(queryParams => {
        const token = queryParams['token'];
        if (eventId && token) {
          this.loadEvent(eventId, token);
        }
      });
    });
  }

  loadEvent(eventId: string, token: string) {
    this.apiService.getPublicEvent(eventId, token).subscribe({
      next: (eventData) => {
        this.event = {
          title: eventData.title,
          date: eventData.startdate,
          image: eventData.image || '/auswahl/hochzeit.jpg',
          street: eventData.street || '',
          zip: eventData.zip || '',
          city: eventData.city || '',
          info: eventData.description
        };

        if (eventData.survey_id) {
          this.surveyAvailable = true;
          this.surveyId = eventData.survey_id;
        }
      },
      error: (error) => {
        console.error('Error loading event:', error);
      }
    });
  }

  submitResponse() {
    if (this.attending === 'yes') {
      console.log('Zusage:', this.guest);
      this.responseMessage = 'Du hast erfolgreich zugesagt!';
    } else if (this.attending === 'no') {
      console.log('Absage');
      this.responseMessage = 'Deine Absage wurde gespeichert.';
    }
    this.responseSubmitted = true;
  }
}