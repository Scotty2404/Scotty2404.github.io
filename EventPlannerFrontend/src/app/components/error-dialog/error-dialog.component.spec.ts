import { ComponentFixture, TestBed } from '@angular/core/testing'; 
import { ErrorDialogComponent } from './error-dialog.component'; 
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { MatButtonModule } from '@angular/material/button'; 
import { NO_ERRORS_SCHEMA } from '@angular/core'; 

describe('ErrorDialogComponent', () => {
  let component: ErrorDialogComponent;
  let fixture: ComponentFixture<ErrorDialogComponent>;

  // Vor jeder Testausführung wird die Testumgebung eingerichtet
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorDialogComponent], // Deklarieren des zu testenden Komponentes
      imports: [MatDialogModule, MatButtonModule], // Benötigte Angular Material Module
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { message: 'Test error message' } }, // Mock-Daten für den Dialog
        { provide: MatDialogRef, useValue: {} } // Mock der MatDialogRef, um den Dialog zu schließen
      ],
      schemas: [NO_ERRORS_SCHEMA] // Verhindert Fehler, wenn andere Teile der Anwendung fehlen (verwendet für den Test)
    }).compileComponents(); // Kompiliert die Komponente für den Test

    fixture = TestBed.createComponent(ErrorDialogComponent); // Erzeugt die Komponente
    component = fixture.componentInstance; // Setzt die Instanz der Komponente
    fixture.detectChanges(); // Ruft das Change Detection-System auf, um die Ansicht zu aktualisieren
  });

  // Test: Überprüft, ob der Dialog korrekt erstellt wurde
  it('should create the error dialog component', () => {
    expect(component).toBeTruthy(); // Erwartet, dass die Komponente erfolgreich instanziiert wurde
  });

  // Test: Überprüft, ob die Nachricht korrekt angezeigt wird
  it('should display the correct error message', () => {
    const compiled = fixture.nativeElement; // Holt das native DOM-Element der Komponente
    const messageElement = compiled.querySelector('mat-dialog-content p'); // Findet das Element, das die Nachricht enthält
    expect(messageElement.textContent).toContain('Test error message'); // Erwartet, dass die Nachricht im Dialog angezeigt wird
  });

  // Test: Überprüft, ob die onClose-Methode aufgerufen wird, wenn der "OK"-Button geklickt wird
  it('should close the dialog when OK is clicked', () => {
    spyOn(component.dialogRef, 'close'); // Überwacht den Aufruf der close-Methode des Dialogs
    const button = fixture.nativeElement.querySelector('button'); // Findet den "OK"-Button
    button.click(); // Simuliert einen Klick auf den Button
    expect(component.dialogRef.close).toHaveBeenCalled(); // Erwartet, dass die close-Methode aufgerufen wurde
  });
});