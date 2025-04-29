// Importieren von Angular-Basisfunktionalitäten und Angular Material Komponenten
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Reaktive Formulare
import { HttpClient, HttpClientModule } from '@angular/common/http'; // HTTP-Client für API-Kommunikation
import { MatFormFieldModule } from '@angular/material/form-field'; // Material FormField
import { MatCardModule } from '@angular/material/card'; // Material Card Layout
import { MatInputModule } from '@angular/material/input'; // Material Input Felder
import { MatButtonModule } from '@angular/material/button'; // Material Buttons
import { FormsModule } from '@angular/forms'; // Template-Driven Forms (nur zur Sicherheit)
import { MatDialog } from '@angular/material/dialog'; // Material Dialog-Service
import { ErrorDialogComponent } from '../../components/error-dialog/error-dialog.component'; // Eigener Fehler-Dialog
import { MatListModule } from '@angular/material/list'; // Material Liste (optional verwendet)
import { RouterModule } from '@angular/router'; // Angular Routing
import { MatIcon } from '@angular/material/icon'; // Material Icons
import { LoadingBoxComponent } from '../../components/loading-box/loading-box.component'; // Lade-Komponente
import { LoadingFailedBoxComponent } from '../../components/loading-failed-box/loading-failed-box.component'; // Fehler-Komponente beim Laden

// Deklaration der Komponente
@Component({
  selector: 'app-contact-page', // CSS-Selektor
  standalone: true, // Komponente ist standalone, kein Angular-Modul nötig
  imports: [ // Alle verwendeten Module und Komponenten
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule, 
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ErrorDialogComponent,
    MatListModule,
    RouterModule,
    MatIcon,
    LoadingBoxComponent,
    LoadingFailedBoxComponent
  ],
  templateUrl: './contact-page.component.html', // Pfad zur HTML-Datei
  styleUrls: ['./contact-page.component.scss'] // Pfad zur SCSS-Datei
})
export class ContactPageComponent implements OnInit {
  
  // Formulargruppe für das Kontaktformular
  contactForm: FormGroup;
  
  // Statusvariablen (für Ladeanzeige und Fehlermeldungen)
  isLoaded = true;
  isFailed = false;

  // Konstruktor: Abhängigkeiten (Services) einfügen
  constructor(
    private fb: FormBuilder, // FormBuilder zum einfachen Erstellen des FormGroups
    private http: HttpClient, // HttpClient für HTTP-Requests
    private dialog: MatDialog // Dialog-Service für Fehleranzeigen
  ) {
    // Initialisieren des Formulars mit FormControls und Validators
    this.contactForm = this.fb.group({
      name: ['', Validators.required], // Name muss ausgefüllt werden
      email: ['', [Validators.required, Validators.email]], // Email muss ausgefüllt und valide sein
      subject: ['', Validators.required], // Betreff erforderlich
      message: ['', Validators.required] // Nachricht erforderlich
    });
  }

  // Lifecycle Hook, hier ungenutzt
  ngOnInit(): void {}

  // Wird beim Abschicken des Formulars aufgerufen
  onSubmit(): void {
    if (this.contactForm.valid) { // Prüfen, ob das Formular valide ist
      const formData = this.contactForm.value; // Formulardaten extrahieren
  
      // POST-Anfrage an das (Platzhalter-)Backend
      this.http.post('https://your-backend-api.com/contact', formData)
        .subscribe({
          next: response => { // Wenn erfolgreich
            console.log('Erfolgreich gesendet:', response);
            this.contactForm.reset(); // Formular zurücksetzen
          },
          error: err => { // Bei Fehler
            console.error('Fehler beim Senden:', err);
            this.openErrorDialog('Es gab einen Fehler beim Absenden, versuche es erneut.'); // Fehlerdialog öffnen
          }
        });
    } else {
      // Formular nicht valide
      console.log('Form is not valid');
    }
  }

  // Öffnet ein Error-Dialogfenster mit einer Nachricht
  openErrorDialog(message: string): void {
    this.dialog.open(ErrorDialogComponent, {
      data: { message: message } // Übergebe die Fehlernachricht an den Dialog
    });
  }
}