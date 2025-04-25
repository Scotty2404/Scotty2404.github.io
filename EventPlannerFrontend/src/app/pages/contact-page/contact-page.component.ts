import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule, 
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent implements OnInit {
  // Definition des Formulars (wird im Konstruktor initialisiert)
  contactForm: FormGroup;

  // Dependency Injection von FormBuilder und HttpClient
  constructor(private fb: FormBuilder, private http: HttpClient) {
    // Initialisierung des Formulars mit leeren Feldern und Validierungen
    this.contactForm = this.fb.group({
      name: ['', Validators.required], // Name ist erforderlich
      email: ['', [Validators.required, Validators.email]], // E-Mail ist erforderlich und muss gültig sein
      subject: ['', Validators.required], // Betreff ist erforderlich
      message: ['', Validators.required] // Nachricht ist erforderlich
    });
  }

  // Initialisierungs-Hook (derzeit nicht genutzt)
  ngOnInit(): void {}

  // Wird beim Absenden des Formulars aufgerufen
  onSubmit(): void {
    // Prüfen, ob das Formular gültig ist
    if (this.contactForm.valid) {
      const formData = this.contactForm.value; // Daten aus dem Formular extrahieren
      console.log('Form Data: ', formData); // Debug-Ausgabe

      // Senden der Formulardaten an die API (Beispiel-URL)
      this.http.post('https://your-backend-api.com/contact', formData)
        .subscribe({
          next: response => console.log('Erfolgreich gesendet:', response), // Erfolgsfall
          error: err => console.error('Fehler beim Senden:', err) // Fehlerfall
        });

      // Formular nach dem Absenden zurücksetzen
      this.contactForm.reset();
    } else {
      console.log('Form is not valid'); // Wenn das Formular nicht korrekt ausgefüllt ist
    }
  }
}