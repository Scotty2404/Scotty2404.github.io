import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { QrDialogComponent } from '../../components/qr-dialog/qr-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-qr-event-page',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatCardModule,
    RouterLink,
    

  ],
  templateUrl: './qr-event-page.component.html',
  styleUrl: './qr-event-page.component.scss'
})
export class QrEventPageComponent {
  attending: 'yes' | 'no' | null = null;
  surveyAvailable = true;
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

  constructor(private dialog: MatDialog) {}

  submitResponse() {
    const isYes = this.attending === 'yes';
    const message = isYes ? 'Du hast erfolgreich zugesagt!' : 'Deine Absage wurde erfolgreich zugeschickt.';
  
    this.dialog.open(QrDialogComponent, {
      data: {
        title: isYes ? '🎉 Zusage gespeichert' : '❌ Absage gespeichert',
        message: message,
        attending: this.attending,
        surveyAvailable: this.surveyAvailable
      }
    });
  
    this.responseSubmitted = true;
    this.responseMessage = message;
  }
  
}