import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';

// Importing project-internal services, models, and components
import { DataService } from '../../services/data.service';
import { ApiService } from '../../services/api.service';
import { SurveyDialogComponent } from '../../components/survey-dialog-box/survey-dialog.component';
import { SurveyQuestionResultBoxComponent } from '../../components/survey-question-result-box/survey-question-result-box.component';
import { Survey } from '../../models/survey.model';
import { MatAccordion } from '@angular/material/expansion';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LoadingBoxComponent } from '../../components/loading-box/loading-box.component';
import { LoadingFailedBoxComponent } from '../../components/loading-failed-box/loading-failed-box.component';

// Interface for survey response data
interface SurveyResponse {
  userId: string;
  userName: string;
  answers: {[key: string]: any};
}

@Component({
  selector: 'app-survey-page',
  standalone: true,
  imports: [
    RouterModule,
    MatButtonModule,
    MatIcon,
    SurveyQuestionResultBoxComponent,
    MatDialogModule,
    SurveyDialogComponent,
    MatExpansionModule,
    MatAccordion,
    LoadingBoxComponent,
    LoadingFailedBoxComponent,
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './survey-page.component.html',
  styleUrls: ['./survey-page.component.scss']
})
export class SurveyPageComponent implements OnInit {
  completedSurveys: Survey[] = [];
  ongoingSurveys: Survey[] = [];

  isLoaded = false;
  isFailed = false;
  eventId: string | null = null;
  surveyId: string | null = null;

  constructor(
    private dataService: DataService,
    private apiService: ApiService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  // Angular Signal for reactive control of accordion status
  panelOpenState = signal(false);

  ngOnInit(): void {
    // Get the event ID from the route
    this.eventId = this.route.snapshot.paramMap.get('id');
    console.log('Event ID from route:', this.eventId);
    
    if (this.eventId) {
      this.loadEventSurveys(this.eventId);
    } else {
      // If no specific event ID, load all surveys (fallback)
      this.loadAllSurveys();
    }
  }

  loadEventSurveys(eventId: string) {
    this.isLoaded = false;
    this.isFailed = false;
  
    // First, get event details to find the survey ID
    this.apiService.getEventById(eventId).subscribe({
      next: (eventData) => {
        console.log('Event data:', eventData);
        if (eventData && eventData.survey_id) {
          this.surveyId = eventData.survey_id;
          console.log('Found survey ID:', this.surveyId);
          
          // If the event has an associated survey, fetch it
          this.apiService.getSurvey(eventData.survey_id).subscribe({
            next: (surveyData) => {
              console.log('Survey data:', surveyData);
              if (surveyData && surveyData.data) {
                // Process the survey based on status
                const survey = this.processSurveyData(surveyData.data);
                
                // Check if the survey is active or completed
                if (surveyData.data.active === false) {
                  survey.status = 'completed';
                  this.completedSurveys = [survey];
                } else {
                  console.log("Survey active?: " + surveyData.data.active)
                  survey.status = 'ongoing';
                  this.ongoingSurveys = [survey];
                }
                
                // Now fetch the results
                this.loadSurveyResults(eventData.survey_id);
              } else {
                console.log('No survey data found');
                this.isLoaded = true; // No data but request succeeded
              }
            },
            error: (error) => {
              console.error('Error loading survey:', error);
              this.isFailed = true;
              this.isLoaded = true;
            }
          });
        } else {
          console.log('No survey ID associated with this event');
          this.isLoaded = true; // No survey associated with the event
        }
      },
      error: (error) => {
        console.error('Error loading event details:', error);
        this.isFailed = true;
        this.isLoaded = true;
      }
    });
  }

  loadSurveyResults(surveyId: string) {
    this.apiService.getSurveyResults(surveyId).subscribe({
      next: (resultsData) => {
        console.log('Survey results:', resultsData);
        if (resultsData && resultsData.data) {
          // Update survey with results data
          this.updateSurveyWithResults(resultsData.data);
        }
        this.isLoaded = true;
      },
      error: (error) => {
        console.error('Error loading survey results:', error);
        this.isLoaded = true;
      }
    });
  }

  loadAllSurveys() {
    // Fallback to load all surveys if no specific event ID
    this.isLoaded = false;
    
    // First try to get surveys from the service
    if (this.dataService.surveyList && this.dataService.surveyList.length > 0) {
      this.ongoingSurveys = this.dataService.surveyList.filter(survey => survey.status === 'ongoing');
      this.completedSurveys = this.dataService.surveyList.filter(survey => survey.status === 'completed');
      this.isLoaded = true;
    }
  }

  processSurveyData(surveyData: any): Survey {
    console.log('Processing survey data:', surveyData);
    
    // Transform API survey data to the Survey model format
    const survey: Survey = {
      id: surveyData.id || surveyData.survey_id,
      survey_id: surveyData.id || surveyData.survey_id,
      title: surveyData.title || 'Unnamed Survey',
      questions: (surveyData.questions || []).map((q: any) => {
        // Create the question object with all required properties
        const question = {
          text: q.questionText,
          answerType: this.mapQuestionType(q.type),
          options: q.options ? q.options.map((o: any) => o.text) : [],
          optionPercentages: new Array(q.options ? q.options.length : 0).fill(0),
          multipleSelection: q.multipleSelection || false,
          scaleValue: q.type === 'scale' ? q.minValue || 1 : undefined,
          answerPercentage: 0,
          answerField: [],
          minValue: q.minValue,
          maxValue: q.maxValue,
          // Custom metadata
          _id: q.id,
          _options: q.options,
        };
        
        return question;
      }),
      // Set status based on active flag
      status: surveyData.active === 0 ? 'completed' : 'ongoing'
    };
    
    console.log('Processed survey:', survey);
    return survey;
  }

  mapQuestionType(type: string): string {
    // Map the backend question types to frontend types
    switch (type) {
      case 'multiple':
        return 'checkbox';
      case 'text':
        return 'open';
      case 'scale':
        return 'scale';
      default:
        return type;
    }
  }

  private updateSurveyWithResults(data: any) {
    console.log('Processing survey results data:', data);
    
    // If we got survey and results data
    if (data.survey && data.results) {
      const surveyData = data.survey;
      const results = data.results;
      
      // Determine which surveys array to update
      let targetSurvey;
      
      // Check if the survey is in ongoingSurveys
      const ongoingIndex = this.ongoingSurveys.findIndex(
        s => (s as any).survey_id == surveyData.id || (s as any).id == surveyData.id
      );
      
      if (ongoingIndex >= 0) {
        targetSurvey = this.ongoingSurveys[ongoingIndex];
      } else {
        // Check if the survey is in completedSurveys
        const completedIndex = this.completedSurveys.findIndex(
          s => (s as any).survey_id == surveyData.id || (s as any).id == surveyData.id
        );
        
        if (completedIndex >= 0) {
          targetSurvey = this.completedSurveys[completedIndex];
        }
      }
      
      // If we found the survey to update
      if (targetSurvey) {
        // Update title and other basic properties
        targetSurvey.title = surveyData.title || targetSurvey.title;
        
        // Add survey ID if missing
        if (!targetSurvey.id && surveyData.id) {
          targetSurvey.id = surveyData.id;
        }
        if (!targetSurvey.survey_id && surveyData.id) {
          targetSurvey.survey_id = surveyData.id;
        }
        
        // For each question in the survey data
        if (surveyData.questions && Array.isArray(surveyData.questions)) {
          surveyData.questions.forEach((apiQuestion: any, index: number) => {
            if (index < targetSurvey.questions.length) {
              // Get the question from target survey
              const question = targetSurvey.questions[index];
              
              // Check if question exists and has answerType before processing
              if (question && question.answerType) {
                // Process results based on question type
                if (question.answerType === 'checkbox') {
                  this.processMultipleChoiceResults(question, apiQuestion, results);
                } else if (question.answerType === 'scale') {
                  this.processScaleResults(question, apiQuestion, results);
                } else if (question.answerType === 'open') {
                  this.processOpenTextResults(question, apiQuestion, results);
                }
              } else {
                console.warn('Skipping question processing due to missing question or answerType:', 
                              {question, apiQuestion, index});
              }
            }
          });
        } else {
          console.warn('No questions array in survey data:', surveyData);
        }
      } else {
        console.warn('Could not find matching survey to update with results');
      }
    } else {
      console.warn('Invalid survey results data structure:', data);
    }
  }


  private processMultipleChoiceResults(question: any, apiQuestion: any, results: any[]) {
    // Get the question ID (handle different property names)
    const questionId = apiQuestion.question_id || apiQuestion.id;
    
    if (!questionId) return;
    
    // Create counters for each option
    const optionCounts = Array(question.options.length).fill(0);
    let totalResponses = 0;
    
    console.log(`Processing results for question ${questionId}:`, results);
    
    // Process each result
    results.forEach((result: any) => {
      // Look for answers to this question
      if (result.answers && result.answers[questionId]) {
        const answer = result.answers[questionId];
        console.log(`Found answers for question ${questionId}:`, answer);
        
        // NEW: Handle the specific format seen in the console
        if (answer && answer.answer && Array.isArray(answer.answer)) {
          // Format seen in the console output
          answer.answer.forEach((optionAnswer: any) => {
            if (optionAnswer.optionId !== undefined) {
              // Find the index of this option in our options array
              const optionIndex = this.findOptionIndexByOfferedAnswersId(question, optionAnswer.optionId);
              console.log(`Option with ID ${optionAnswer.optionId} maps to index ${optionIndex}`);
              
              if (optionIndex >= 0 && optionIndex < optionCounts.length) {
                optionCounts[optionIndex]++;
                totalResponses++;
              }
            }
          });
        }
        // Keep the existing code as fallback
        else if (Array.isArray(answer)) {
          // Old logic for multiple selection
          answer.forEach(singleAnswer => {
            const optionId = typeof singleAnswer === 'number' ? singleAnswer : 
                            (singleAnswer.optionId || singleAnswer.offered_answers_id);
            
            const optionIndex = this.findOptionIndexByOfferedAnswersId(question, optionId);
            
            if (optionIndex >= 0 && optionIndex < optionCounts.length) {
              optionCounts[optionIndex]++;
              totalResponses++;
            }
          });
        } else if (typeof answer === 'number') {
          // Old logic for single numerical answer
          const optionIndex = this.findOptionIndexByOfferedAnswersId(question, answer);
          
          if (optionIndex >= 0 && optionIndex < optionCounts.length) {
            optionCounts[optionIndex]++;
            totalResponses++;
          }
        }
      }
    });
    
    console.log(`Question ${questionId} - Total responses: ${totalResponses}, Counts:`, optionCounts);
    
    // Calculate percentages
    if (totalResponses > 0) {
      question.optionPercentages = optionCounts.map(count => 
        Math.round((count / totalResponses) * 100)
      );
    } else {
      question.optionPercentages = Array(question.options.length).fill(0);
    }
    
    console.log(`Question ${questionId} - Percentages:`, question.optionPercentages);
  }

  // Helper method to find the correct option index by mapping offered_answers_id
  private findOptionIndexByOfferedAnswersId(question: any, optionId: any): number {
    console.log('Finding option index for:', optionId);
    console.log('Question _options:', question._options);
    
    // If we have the original options array with IDs
    if (question._options && Array.isArray(question._options)) {
      for (let i = 0; i < question._options.length; i++) {
        const option = question._options[i];
        if (option.id == optionId || option.offered_answers_id == optionId) {
          return i;
        }
      }
    }
    
    // If optionId is a direct index
    if (typeof optionId === 'number' && optionId >= 0 && optionId < question.options.length) {
      return optionId;
    }
    
    // The option IDs might be in a different order than the options array
    // In your case, we need to map offered_answers_id values (95, 96, 97) to indices (0, 1, 2)
    // The simplest approach is to use modulo math if the IDs follow a pattern
    if (typeof optionId === 'number' || !isNaN(parseInt(String(optionId)))) {
      const numericId = typeof optionId === 'number' ? optionId : parseInt(String(optionId));
      // This is a simplification - you might need to adjust based on your actual ID pattern
      return numericId % question.options.length;
    }
    
    console.warn('Could not map option ID to index:', optionId);
    return -1;
  }
  
  private findOptionIndex(optionId: any, apiQuestion: any): number {
    // Get the options array
    const options = apiQuestion.options || [];
    
    console.log('Finding option index for ID:', optionId);
    console.log('Available options:', options);
    
    // Try to find by id
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if ((option.id !== undefined && option.id == optionId) || 
          (option.offered_answers_id !== undefined && option.offered_answers_id == optionId)) {
        return i;
      }
    }
    
    // Direct index mapping - if the option ID is a valid index in our array
    if (typeof optionId === 'number' && optionId >= 0 && optionId < options.length) {
      return optionId;
    }
    
    // If we have an offered_answers_id that couldn't be mapped directly,
    // try to find it by iterating through options
    if (typeof optionId === 'number' || typeof optionId === 'string') {
      // Just use the index directly as a fallback
      // Many backends return options in the same order as they're defined
      const numericId = parseInt(optionId.toString());
      if (!isNaN(numericId) && numericId < options.length) {
        return numericId;
      }
    }
    
    console.warn('Could not map option ID to index:', optionId);
    return -1;
  }

// Helper method for processing scale questions
private processScaleResults(question: any, apiQuestion: any, results: any[]) {
  const questionId = apiQuestion.question_id || apiQuestion.id;
  if (!questionId) return;
  
  let totalScore = 0;
  let count = 0;
  
  results.forEach((result: any) => {
    if (result.answers && result.answers[questionId] !== undefined) {
      const answer = result.answers[questionId];
      
      // Handle different formats of scale answers
      if (typeof answer === 'number') {
        totalScore += answer;
        count++;
      } else if (answer && answer.scale_answer !== undefined) {
        totalScore += answer.scale_answer;
        count++;
      } else if (typeof answer === 'object' && answer.answer !== undefined) {
        // Additional format seen in some responses
        totalScore += Number(answer.answer);
        count++;
      }
    }
  });
  
  if (count > 0) {
    const avgScore = totalScore / count;
    question.scaleValue = Math.round(avgScore);
    
    // Calculate percentage of max value
    const maxValue = apiQuestion.maxValue || apiQuestion._maxValue || 5;
    const minValue = apiQuestion.minValue || apiQuestion._minValue || 1;
    const range = maxValue - minValue;
    
    // Calculate percentage
    if (range > 0) {
      const normalizedValue = (avgScore - minValue) / range;
      question.answerPercentage = Math.round(normalizedValue * 100);
    } else {
      question.answerPercentage = Math.round((avgScore / maxValue) * 100);
    }
    
    console.log(`Scale question ${questionId}: avgScore=${avgScore}, percentage=${question.answerPercentage}%`);
  } else {
    question.scaleValue = 0;
    question.answerPercentage = 0;
  }
}

  // Helper method for processing text questions
  private processOpenTextResults(question: any, apiQuestion: any, results: any[]) {
    const questionId = apiQuestion.question_id || apiQuestion.id;
    if (!questionId) return;
    
    const textAnswers: string[] = [];
    
    results.forEach((result: any) => {
      if (result.answers && result.answers[questionId] !== undefined) {
        const answer = result.answers[questionId];
        
        // Handle different formats of text answers
        if (typeof answer === 'string' && answer.trim() !== '') {
          textAnswers.push(answer);
        } else if (answer && answer.text_answer && answer.text_answer.trim() !== '') {
          textAnswers.push(answer.text_answer);
        } else if (typeof answer === 'object' && answer.answer !== undefined) {
          // Additional format seen in some responses
          if (typeof answer.answer === 'string' && answer.answer.trim() !== '') {
            textAnswers.push(answer.answer);
          }
        }
      }
    });
    
    console.log(`Text question ${questionId}: ${textAnswers.length} answers collected`);
    question.answerField = textAnswers;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SurveyDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('New survey created:', result);
  
        // If we have an event ID, associate the survey with this event
        if (this.eventId !== null && result) {
          // Prepare survey data for API
          const surveyData = {
            title: `Umfrage für ${result.title || 'Event'}`,
            description: 'Event-Umfrage',
            questions: result.questions.map((q: any) => ({
              question: q.text,
              answerType: this.mapQuestionTypeToBackend(q.answerType),
              answers: q.options || [],
              multipleSelection: q.multipleSelection || false
            }))
          };
          
          // Save the survey via API
          this.apiService.createSurvey(surveyData).subscribe({
            next: (response) => {
              console.log('Survey saved successfully:', response);
              if (response && response.success && response.survey_id) {
                // After creating survey, update the event with the survey ID
                // Use non-null assertion operator to tell TypeScript that eventId is definitely not null here
                this.updateEventWithSurvey(this.eventId!, response.survey_id);
                
                // Convert back to our model format and add to UI
                const newSurvey = this.processSurveyData(response.data);
                newSurvey.id = response.survey_id;
                this.ongoingSurveys.push(newSurvey);
              }
            },
            error: (error) => {
              console.error('Error saving survey:', error);
            }
          });
        } else {
          // Just add to the local list if no event ID
          this.ongoingSurveys.push(result);
          this.dataService.addSurvey(result);
        }
      }
    });
  }

  private updateEventWithSurvey(eventId: string, surveyId: string | number): void {
    const surveyIdStr = surveyId.toString();
    console.log(`Attempting to update event ${eventId} with survey ID ${surveyIdStr}`);
    
    this.apiService.updateEventSurvey(eventId, surveyIdStr).subscribe({
      next: (response) => {
        console.log('Event updated with survey ID successfully:', response);
      },
      error: (error) => {
        console.error('Error updating event with survey ID:', error);
        // Add a more detailed error log to help debug
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error details:', error.error);
      }
    });
  }

  mapQuestionTypeToBackend(type: string): string {
    // Map the frontend question types to backend types
    switch (type) {
      case 'checkbox':
        return 'multiple';
      case 'open':
        return 'text';
      case 'scale':
        return 'scale';
      default:
        return type;
    }
  }

  completeSurvey(survey: Survey): void {
    console.log('SurveyPageComponent.completeSurvey() called with:', survey);
    
    // Ensure we have the survey ID
    if (this.surveyId) {
      console.log('Using surveyId from component state:', this.surveyId);
      
      // Mark the survey as completed in the backend
      this.apiService.completeSurvey(this.surveyId).subscribe({
        next: (response) => {
          console.log('Survey completed successfully:', response);
          // Move the survey from ongoing to completed
          this.ongoingSurveys = this.ongoingSurveys.filter(s => s !== survey);
          survey.status = 'completed';
          this.completedSurveys.push(survey);
        },
        error: (error) => {
          console.error('Error completing survey:', error);
        }
      });
    } else if (survey.id || survey.survey_id) {
      // Use the ID from the survey object as fallback
      const surveyId = survey.id || survey.survey_id;
      console.log('Using survey ID from survey object:', surveyId);
      
      this.apiService.completeSurvey(surveyId.toString()).subscribe({
        next: (response) => {
          console.log('Survey completed successfully:', response);
          this.ongoingSurveys = this.ongoingSurveys.filter(s => s !== survey);
          survey.status = 'completed';
          this.completedSurveys.push(survey);
        },
        error: (error) => {
          console.error('Error completing survey:', error);
        }
      });
    } else {
      console.error('No survey ID available for completion:', {
        componentSurveyId: this.surveyId,
        surveyObject: survey
      });
    }
  }
}