import { Component } from '@angular/core';
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
export class QrEventPageComponent {
  attending: 'yes' | 'no' | null = null;
  surveyAvailable = true; // ← vom Backend setzen, falls es eine Umfrage gibt
  responseSubmitted = false;
  responseMessage = '';

  guest = {
    firstname: '',
    lastname: '',
    mail: '',
    info: '',
    password: ''
  };

  // Beispiel-Daten für das Event (kannst du natürlich dynamisch laden)
  event = {
    title: 'Ellis Geburtstag',
    date: '2025-06-28T15:00:00',
    image: '/auswahl/hochzeit.jpg',
    street: 'Hauptstraße 123',
    zip: '12345',
    city: 'Beispielstadt',
    info: 'Ein gemütliches Beisammensein mit Essen, Musik und Spielen.'
  };

  submitResponse() {
    if (this.attending === 'yes') {
      console.log('Zusage:', this.guest);
      this.responseMessage = 'Du hast erfolgreich zugesagt!';
    } else if (this.attending === 'no') {
      console.log('Absage');
      this.responseMessage = 'Deine Absage wurde gespeichert.';
    }
    alert('Antwort wurde übermittelt. Danke!');
    this.responseSubmitted = true;
  }
}