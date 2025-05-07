// Importiere Test-Utilities von Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Komponente, die getestet wird
import { SurveyQuestionResultBoxComponent } from './survey-question-result-box.component';

// Mocking für Dialoge
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

// Importiere das Umfrage-Modell
import { Survey } from '../../models/survey.model';

describe('SurveyQuestionResultBoxComponent', () => {
  let component: SurveyQuestionResultBoxComponent;
  let fixture: ComponentFixture<SurveyQuestionResultBoxComponent>;

  // Ein Mock-Objekt für den Angular Material Dialog-Service
  let mockDialog: jasmine.SpyObj<MatDialog>;

  // Beispielhafte Umfrage zur Verwendung in den Tests
  const mockSurvey: Survey = {
    title: 'Testumfrage',
    status: 'ongoing',
    questions: [
      {
        text: 'Frage 1',
        answerType: 'checkbox',
        options: ['A', 'B'],
        optionPercentages: [50, 50]
      }
    ]
  };

  beforeEach(async () => {
    // Erstelle ein Spy-Objekt für MatDialog mit der Methode "open"
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    // Initialisiere das Testmodul mit der zu testenden Komponente
    await TestBed.configureTestingModule({
      imports: [SurveyQuestionResultBoxComponent], // "standalone: true" erlaubt direkten Import
      providers: [
        { provide: MatDialog, useValue: mockDialog } // Verwende das Mock-Dialog-Objekt
      ]
    }).compileComponents();

    // Erstelle Komponente + DOM-Fixture
    fixture = TestBed.createComponent(SurveyQuestionResultBoxComponent);
    component = fixture.componentInstance;

    // Setze initiale Testdaten
    component.data = [mockSurvey];
    fixture.detectChanges(); // Aktualisiere das Rendering
  });

  it('should create', () => {
    // Test: Komponente wird korrekt erstellt
    expect(component).toBeTruthy();
  });

  it('should emit complete event when user confirms', () => {
    // Überwache das EventEmitter-Emit
    const spy = spyOn(component.complete, 'emit');

    // Simuliere den Dialog, der "true" zurückgibt (Bestätigung)
    const mockRef = {
      afterClosed: () => of(true)
    } as any;

    mockDialog.open.and.returnValue(mockRef);

    // Rufe die Methode auf, die den Dialog öffnet
    component.completeSurvey(mockSurvey);

    // Erwartung: Das "complete"-Event wurde mit der Umfrage ausgelöst
    expect(spy).toHaveBeenCalledWith(mockSurvey);
  });

  it('should NOT emit complete event when user cancels', () => {
    // Überwache das EventEmitter-Emit
    const spy = spyOn(component.complete, 'emit');

    // Simuliere den Dialog, der "false" zurückgibt (Abbruch)
    const mockRef = {
      afterClosed: () => of(false)
    } as any;

    mockDialog.open.and.returnValue(mockRef);

    // Rufe die Methode auf, die den Dialog öffnet
    component.completeSurvey(mockSurvey);

    // Erwartung: Das "complete"-Event wurde **nicht** ausgelöst
    expect(spy).not.toHaveBeenCalled();
  });

  it('should update checkbox question percentages randomly', () => {
    // Speichere die ursprünglichen Werte zur späteren Überprüfung
    const oldValues = [...mockSurvey.questions[0].optionPercentages!];

    // Führe die Aktualisierung durch
    component.updateSurveyResults(mockSurvey);

    // Lese die neuen Werte
    const newValues = mockSurvey.questions[0].optionPercentages!;

    // Erwartung: Neue Werte sollten unterschiedlich zu den alten sein
    expect(newValues).not.toEqual(oldValues);
  });
});