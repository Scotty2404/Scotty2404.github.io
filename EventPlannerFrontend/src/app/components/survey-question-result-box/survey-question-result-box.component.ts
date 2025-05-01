import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator'; // Material Design Paginator
import { MatSort } from '@angular/material/sort'; // Material Design Sortierfunktion
import { MatFormFieldModule } from '@angular/material/form-field'; // Form-Field Modul
import { MatLabel } from '@angular/material/form-field'; // Material Label
import { MatIcon } from '@angular/material/icon'; // Material Icon
import { MatPaginatorModule } from '@angular/material/paginator'; // Paginator Modul
import { MatTableModule } from '@angular/material/table'; // Material Table Modul
import { MatButtonModule } from '@angular/material/button'; // Material Button Modul
import { MatCardModule } from '@angular/material/card'; // Material Card Modul
import { MatTabsModule } from '@angular/material/tabs'; // Material Tabs Modul
import { MatCheckboxModule } from '@angular/material/checkbox'; // Material Checkbox Modul
import { MatInputModule } from '@angular/material/input'; // Material Input Modul
import { MatSliderModule } from '@angular/material/slider'; // Material Slider Modul
import { MatProgressBarModule } from '@angular/material/progress-bar'; // Material ProgressBar Modul
import { MatListModule } from '@angular/material/list'; // Material List Modul
import { Survey } from '../../models/survey.model'; // Survey-Modell für Umfragen
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component'; // Bestätigungsdialog-Komponente
import { MatDialog } from '@angular/material/dialog'; // Dialog-Modul von Material Design
import { ChangeDetectorRef } from '@angular/core'; // Für manuelles Triggern der Änderungserkennung
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-survey-question-result-box', // Der Selektor für das Komponententemplate
  standalone: true, // Standalone-Komponente
  imports: [
    // Die Module, die in der Komponente verwendet werden
    MatPaginator,
    MatSort,
    CommonModule,
    MatFormFieldModule,
    MatLabel,
    MatIcon,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatCheckboxModule,
    MatInputModule,
    MatSliderModule,
    MatProgressBarModule,
    MatListModule,
    ConfirmDialogComponent
  ],
  templateUrl: './survey-question-result-box.component.html', // Das zugehörige HTML-Template
  styleUrls: ['./survey-question-result-box.component.scss'] // Das zugehörige CSS-Styling
})
export class SurveyQuestionResultBoxComponent {
  // Eingabedaten (Input), die vom Parent übergeben werden
  @Input() data: Survey[] = []; // Array von Umfragen (Survey) für die Anzeige der Fragen und Ergebnisse

  // Steuerung, ob der "Abschließen"-Button angezeigt wird
  @Input() showCompleteButton: boolean = false; // Boolean für die Sichtbarkeit des Buttons

  // Ausgabe-Event (Output) für das Abschließen der Umfrage
  @Output() complete = new EventEmitter<Survey>(); // Event, das ausgelöst wird, wenn eine Umfrage abgeschlossen wird

  // Variable für die Auswahl des Fragetyp-Tabs (zum Beispiel Checkbox, Skala, etc.)
  selectedAnswerTypeIndex = 0;

  constructor(
    private dialog: MatDialog, 
    private cdr: ChangeDetectorRef,
    private apiService: ApiService
  ) {}

  /**
   * Diese Methode öffnet einen Bestätigungsdialog, um die Umfrage abzuschließen.
   * Falls der Benutzer bestätigt, wird das 'complete' Event ausgelöst.
   */
  completeSurvey(survey: Survey): void {
    console.log('completeSurvey was called for survey:', survey);
  
    // Open the confirmation dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      disableClose: true
    });
  
    console.log('Dialog opened:', dialogRef);
  
    // When dialog is closed, check the result
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed, result:', result);
  
      // If user confirmed
      if (result === true) {
        console.log('User confirmed - completing survey');
        
        // Get the survey ID (handle different property names)
        const surveyId = (survey as any).survey_id || (survey as any).id;
        
        if (surveyId) {
          // Emit the complete event to be handled by the parent component
          this.complete.emit(survey);
        } else {
          console.error('Unable to complete survey: No survey ID found');
        }
      } else {
        console.log('User canceled - survey will NOT be completed');
      }
    });
  }

  /**
   * Diese Methode simuliert das Aktualisieren der Umfrageergebnisse,
   * die Werte werden randomisiert, um einen dynamischen Test zu ermöglichen.
   */
  updateSurveyResults(survey: Survey): void {
    console.log('Updating survey:', survey.title);
    
    // Get the survey ID (handle different property names)
    const surveyId = (survey as any).survey_id || (survey as any).id;
    
    if (surveyId) {
      // Use the API to get real results from the database
      this.apiService.getSurveyResults(surveyId.toString()).subscribe({
        next: (results) => {
          console.log('Fetched survey results:', results);
          if (results && results.data) {
            // Process the real data from the database
            this.updateSurveyWithRealData(survey, results.data);
          }
          // Update the UI
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error fetching survey results:', error);
          // Fallback to random data on error
          this.cdr.detectChanges();
        }
      });
    } else {
      this.cdr.detectChanges();
    }
  }
  
  // Helper method to process real data from the database
  private updateSurveyWithRealData(survey: Survey, data: any): void {
    console.log('Processing real survey data:', data);
    
    // Check if we have both survey and results data
    if (data.survey && data.results) {
      const resultsArray = data.results;
      
      // Process each question in the survey
      survey.questions.forEach((question) => {
        // Get the question ID
        const questionId = (question as any).question_id || (question as any).id;
        
        if (!questionId) {
          console.warn('Question has no ID, skipping:', question);
          return;
        }
        
        if (question.answerType === 'checkbox' && question.options) {
          // For checkbox questions, calculate percentage for each option
          this.processMultipleChoiceQuestion(question, questionId, resultsArray);
        } else if (question.answerType === 'scale') {
          // For scale questions, calculate average rating
          this.processScaleQuestion(question, questionId, resultsArray);
        } else if (question.answerType === 'open') {
          // For open questions, collect all text answers
          this.processOpenQuestion(question, questionId, resultsArray);
        }
      });
    } else {
      console.warn('Incomplete survey data structure:', data);
    }
  }
  
  // Process multiple choice questions
  private processMultipleChoiceQuestion(question: any, questionId: string | number, results: any[]): void {
    // Create counters for each option
    const optionCounts = Array(question.options.length).fill(0);
    let totalResponses = 0;
    
    // Go through each survey response
    results.forEach(result => {
      // Check if this response has an answer for our question
      if (result.answers && result.answers[questionId]) {
        const answer = result.answers[questionId];
        
        // Handle different answer formats
        if (Array.isArray(answer)) {
          // Multiple selection case
          answer.forEach(selection => {
            const index = this.getOptionIndex(selection, question.options.length);
            if (index >= 0) {
              optionCounts[index]++;
              totalResponses++;
            }
          });
        } else if (typeof answer === 'number') {
          // Direct index case
          if (answer >= 0 && answer < optionCounts.length) {
            optionCounts[answer]++;
            totalResponses++;
          }
        } else if (answer.offered_answers_id) {
          // Database format with offered_answers_id
          // Need to map this ID to the correct index in our options array
          // This might require additional logic depending on your database structure
          const index = this.findOptionIndexByOfferedAnswersId(question, answer.offered_answers_id);
          if (index >= 0) {
            optionCounts[index]++;
            totalResponses++;
          }
        }
      }
    });
    
    // Calculate percentages
    if (totalResponses > 0) {
      question.optionPercentages = optionCounts.map(count => 
        Math.round((count / totalResponses) * 100)
      );
    } else {
      // No responses yet
      question.optionPercentages = question.options.map(() => 0);
    }
    
    console.log('Processed multiple choice question:', {
      questionId,
      options: question.options,
      counts: optionCounts,
      percentages: question.optionPercentages,
      totalResponses
    });
  }
  
  // Helper to find option index by offered_answers_id
  private findOptionIndexByOfferedAnswersId(question: any, offeredAnswersId: any): number {
    // This is a placeholder - you'll need to adapt this to your database structure
    // In your database, each question has options with IDs (offered_answers_id)
    // You need to map these IDs to indices in the question.options array
    
    // If the question has a mapping of option IDs
    if (question.optionIds) {
      return question.optionIds.indexOf(offeredAnswersId);
    }
    
    // Default to using it as an index if it's a number
    if (typeof offeredAnswersId === 'number' && 
        offeredAnswersId >= 0 && 
        offeredAnswersId < question.options.length) {
      return offeredAnswersId;
    }
    
    console.warn('Could not map offered_answers_id to option index:', offeredAnswersId);
    return -1;
  }
  
  // Helper to get option index from various answer formats
  private getOptionIndex(answer: any, optionsLength: number): number {
    if (typeof answer === 'number') {
      // Direct index
      if (answer >= 0 && answer < optionsLength) {
        return answer;
      }
    } else if (answer.optionId !== undefined) {
      // Object with optionId
      if (answer.optionId >= 0 && answer.optionId < optionsLength) {
        return answer.optionId;
      }
    } else if (answer.offered_answers_id !== undefined) {
      // Object with offered_answers_id (database format)
      // You might need more logic here to map to the correct index
      if (answer.offered_answers_id >= 0 && answer.offered_answers_id < optionsLength) {
        return answer.offered_answers_id;
      }
    }
    
    console.warn('Could not determine option index from answer:', answer);
    return -1;
  }
  
  // Process scale questions
  private processScaleQuestion(question: any, questionId: string | number, results: any[]): void {
    let totalValue = 0;
    let count = 0;
    
    // Go through each survey response
    results.forEach(result => {
      if (result.answers && result.answers[questionId] !== undefined) {
        const answer = result.answers[questionId];
        
        // Handle different answer formats
        if (typeof answer === 'number') {
          totalValue += answer;
          count++;
        } else if (answer.scale_answer !== undefined) {
          totalValue += answer.scale_answer;
          count++;
        }
      }
    });
    
    // Calculate average and percentage
    if (count > 0) {
      const avgValue = totalValue / count;
      question.scaleValue = Math.round(avgValue);
      
      // Calculate percentage (based on the scale range)
      const minValue = question.minValue || 1;
      const maxValue = question.maxValue || 5;
      const range = maxValue - minValue;
      
      if (range > 0) {
        const normalized = (avgValue - minValue) / range;
        question.answerPercentage = Math.round(normalized * 100);
      } else {
        question.answerPercentage = 0;
      }
    } else {
      // No responses yet
      question.scaleValue = question.minValue || 0;
      question.answerPercentage = 0;
    }
    
    console.log('Processed scale question:', {
      questionId,
      scaleValue: question.scaleValue,
      answerPercentage: question.answerPercentage,
      responses: count
    });
  }
  
  // Process open text questions
  private processOpenQuestion(question: any, questionId: string | number, results: any[]): void {
    const answers: string[] = [];
    
    // Go through each survey response
    results.forEach(result => {
      if (result.answers && result.answers[questionId] !== undefined) {
        const answer = result.answers[questionId];
        
        // Handle different answer formats
        if (typeof answer === 'string' && answer.trim() !== '') {
          answers.push(answer);
        } else if (answer.text_answer && answer.text_answer.trim() !== '') {
          answers.push(answer.text_answer);
        }
      }
    });
    
    // Store the answers
    question.answerField = answers;
    
    console.log('Processed open question:', {
      questionId,
      answerCount: answers.length,
      answers: answers
    });
  }
}