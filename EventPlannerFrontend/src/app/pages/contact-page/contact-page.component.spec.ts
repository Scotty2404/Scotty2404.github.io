import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactPageComponent } from './contact-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

describe('ContactPageComponent', () => {
  let component: ContactPageComponent;
  let fixture: ComponentFixture<ContactPageComponent>;
  let httpMock: HttpTestingController;

  // Testumgebung konfigurieren (ähnlich wie AppModule)
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule, // Stellt einen Mock für HttpClient bereit
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule
      ],
      declarations: [ContactPageComponent]
    }).compileComponents();
  });

  // Vor jedem Test Komponente und Fixture initialisieren
  beforeEach(() => {
    fixture = TestBed.createComponent(ContactPageComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController); // Zugriff auf den HttpClient-Interceptor
    fixture.detectChanges(); // Datenbindung initialisieren
  });

  // Test: Komponente wird korrekt erstellt
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Test: Formular ist beim Start ungültig (alle Felder leer)
  it('should have an invalid form when empty', () => {
    expect(component.contactForm.valid).toBeFalse();
  });

  // Test: Formular wird gültig, wenn alle Felder korrekt ausgefüllt sind
  it('should have a valid form when all fields are filled', () => {
    component.contactForm.setValue({
      name: 'Test Name',
      email: 'test@example.com',
      subject: 'Betreff',
      message: 'Nachricht'
    });

    expect(component.contactForm.valid).toBeTrue();
  });

  // Test: onSubmit() sendet Daten korrekt
  it('should send form data on submit if form is valid', () => {
    // Füllen des Formulars mit gültigen Daten
    const testData = {
      name: 'Test Name',
      email: 'test@example.com',
      subject: 'Test Betreff',
      message: 'Dies ist eine Testnachricht.'
    };

    component.contactForm.setValue(testData);
    component.onSubmit(); // Methode manuell auslösen

    // Prüfen, ob ein HTTP-POST erfolgt ist
    const req = httpMock.expectOne('https://your-backend-api.com/contact');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(testData);

    // Simuliere Antwort vom Server
    req.flush({ success: true });

    // Nach dem Senden sollte das Formular zurückgesetzt sein
    expect(component.contactForm.value).toEqual({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  });

  // Sicherstellen, dass keine offenen HTTP-Anfragen nach Tests übrig bleiben
  afterEach(() => {
    httpMock.verify();
  });
});