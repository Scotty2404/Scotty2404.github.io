import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SurveyDialogComponent } from './survey-dialog.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

describe('SurveyDialogComponent', () => {
  let component: SurveyDialogComponent;  // Deklariert die Komponente, die getestet wird.
  let fixture: ComponentFixture<SurveyDialogComponent>;  // Fixture stellt die Testinstanz der Komponente dar.

  beforeEach(async () => {
    // Bevor jeder Test ausgeführt wird, konfiguriere das Testmodul.
    await TestBed.configureTestingModule({
      declarations: [SurveyDialogComponent],  // Deklariert die Komponente, die getestet wird.
      imports: [MatDialogModule, ReactiveFormsModule],  // Importiert alle erforderlichen Module, die die Komponente benötigt.
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy() } }  // Mock für MatDialogRef, damit die Dialog-Referenz im Test überprüft werden kann.
      ]
    }).compileComponents();  // Kompiliert die Testkomponenten.

    // Erstelle die Testinstanz der Komponente und initialisiere die fixture.
    fixture = TestBed.createComponent(SurveyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();  // Detektiert Änderungen, um die initiale Darstellung der Komponente zu erzwingen.
  });

  // Test 1: Überprüft, ob die Komponente korrekt erstellt wird.
  it('should create the SurveyDialogComponent', () => {
    expect(component).toBeTruthy();  // Erwartet, dass die Komponente erfolgreich erstellt wurde.
  });

  // Test 2: Überprüft, ob eine Frage korrekt zur Umfrage hinzugefügt wird.
  it('should add a question to the survey', () => {
    // Setzt die neuen Frage- und Optionen-Werte.
    component.newQuestion.text = 'What is your favorite color?';
    component.newQuestion.answerType = 'checkbox';  // Setzt den Fragetyp auf Checkbox.
    component.newQuestion.options = ['Red', 'Blue'];  // Setzt zwei Optionen.
    
    // Ruft die Methode auf, um die Frage hinzuzufügen.
    component.onNextQuestion();

    // Überprüft, ob die Frage tatsächlich zur Umfrage hinzugefügt wurde.
    expect(component.survey.questions.length).toBe(1);  // Erwartet, dass die Umfrage jetzt eine Frage enthält.
    expect(component.survey.questions[0].text).toBe('What is your favorite color?');  // Überprüft den Text der hinzugefügten Frage.
  });

  // Test 3: Überprüft, ob eine Fehlermeldung angezeigt wird, wenn nicht genügend Optionen für eine Checkbox-Frage vorhanden sind.
  it('should show error when checkbox options are less than 2', () => {
    // Setzt die Frage und Optionen, aber mit nur einer Option.
    component.newQuestion.answerType = 'checkbox';
    component.newQuestion.options = ['Only one option'];
    
    // Versucht, die Frage hinzuzufügen.
    component.onNextQuestion();

    // Erwartet, dass eine Fehlermeldung angezeigt wird, da nur eine Option vorhanden ist.
    expect(component.showOptionError).toBeTrue();  // Erwartet, dass die Fehleranzeige aktiviert wird.
  });

  // Test 4: Überprüft, ob eine Frage aus der Umfrage entfernt wird.
  it('should remove a question from the survey', () => {
    // Füge eine Frage zur Umfrage hinzu.
    component.newQuestion.text = 'What is your favorite color?';
    component.newQuestion.answerType = 'checkbox';
    component.newQuestion.options = ['Red', 'Blue'];
    component.onNextQuestion();  // Frage wird hinzugefügt.

    // Erwartet, dass die Umfrage eine Frage enthält.
    expect(component.survey.questions.length).toBe(1);

    // Entferne die Frage an Index 0 (erste Frage).
    component.removeQuestion(0);

    // Überprüft, dass die Umfrage nun leer ist.
    expect(component.survey.questions.length).toBe(0);
  });

  // Test 5: Überprüft, ob die Methode onSave die Umfrage speichert und den Dialog schließt.
  it('should call onSave and close the dialog with the survey data', () => {
    // Mock für den DialogRef zum Überprüfen des `close`-Verhaltens.
    spyOn(component.dialogRef, 'close');

    // Setzt eine Frage und Optionen.
    component.newQuestion.text = 'What is your favorite color?';
    component.newQuestion.answerType = 'checkbox';
    component.newQuestion.options = ['Red', 'Blue'];
    
    // Ruft die Methode onSave auf, um die Umfrage zu speichern.
    component.onSave();

    // Überprüft, ob der Dialog mit den Umfrage-Daten geschlossen wurde.
    expect(component.dialogRef.close).toHaveBeenCalledWith(component.survey);  // Erwartet, dass `close` mit der Umfrage aufgerufen wurde.
  });
});