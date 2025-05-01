import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

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
    LoadingFailedBoxComponent
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
                
                // For demonstration, treat existing surveys as ongoing
                this.ongoingSurveys = [survey];
                
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
    } else {
      // If no surveys in the service, try to load sample data
      this.loadSampleSurveys();
    }
  }

  loadSampleSurveys() {
    // Create some sample surveys if needed
    const sampleSurvey: Survey = {
      title: 'Sample Survey',
      questions: [
        {
          text: 'What is your favorite color?',
          answerType: 'checkbox',
          options: ['Red', 'Blue', 'Green', 'Yellow'],
          optionPercentages: [25, 40, 20, 15],
        },
        {
          text: 'How would you rate this event?',
          answerType: 'scale',
          scaleValue: 4,
          answerPercentage: 80
        }
      ],
      status: 'ongoing'
    };
    
    // Add to our list
    this.ongoingSurveys = [sampleSurvey];
    
    // Add to the service for future reference
    this.dataService.addSurvey(sampleSurvey);
    
    this.isLoaded = true;
  }

  processSurveyData(surveyData: any): Survey {
    console.log('Processing survey data:', surveyData);
    
    // Transform API survey data to the Survey model format
    const survey: Survey = {
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
          // Custom metadata
          _id: q.id,
          _options: q.options,
          _minValue: q.minValue,
          _maxValue: q.maxValue
        };
        
        return question;
      }),
      status: 'ongoing' // Default status
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

  updateSurveyWithResults(data: any) {
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
        
        // For each question in the survey
        surveyData.questions.forEach((apiQuestion: any, index: number) => {
          if (index < targetSurvey.questions.length) {
            const question = targetSurvey.questions[index];
            
            // Process results based on question type
            if (question.answerType === 'checkbox') {
              this.processMultipleChoiceResults(question, apiQuestion, results);
            } else if (question.answerType === 'scale') {
              this.processScaleResults(question, apiQuestion, results);
            } else if (question.answerType === 'open') {
              this.processOpenTextResults(question, apiQuestion, results);
            }
          }
        });
      }
    }
  }


// Helper method for processing multiple choice questions
private processMultipleChoiceResults(question: any, apiQuestion: any, results: any[]) {
  // Get the question ID (handle different property names)
  const questionId = apiQuestion.question_id || apiQuestion.id;
  
  if (!questionId) return;
  
  // Create counters for each option
  const optionCounts = Array(question.options.length).fill(0);
  let totalResponses = 0;
  
  // Process each result
  results.forEach((result: any) => {
    // Look for answers to this question
    if (result.answers && result.answers[questionId]) {
      const answers = result.answers[questionId];
      
      // Handle different answer formats
      if (Array.isArray(answers)) {
        // Multiple selection
        answers.forEach(answer => {
          // Get the option index
          const optionId = typeof answer === 'number' ? answer : 
                          (answer.optionId || answer.offered_answers_id);
          
          // Find corresponding index in our options array
          const optionIndex = this.findOptionIndex(optionId, apiQuestion);
          
          if (optionIndex >= 0 && optionIndex < optionCounts.length) {
            optionCounts[optionIndex]++;
            totalResponses++;
          }
        });
      } else if (typeof answers === 'number') {
        // Single selection as number
        const optionIndex = this.findOptionIndex(answers, apiQuestion);
        if (optionIndex >= 0 && optionIndex < optionCounts.length) {
          optionCounts[optionIndex]++;
          totalResponses++;
        }
      } else if (answers.optionId || answers.offered_answers_id) {
        // Single selection as object
        const optionId = answers.optionId || answers.offered_answers_id;
        const optionIndex = this.findOptionIndex(optionId, apiQuestion);
        if (optionIndex >= 0 && optionIndex < optionCounts.length) {
          optionCounts[optionIndex]++;
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
    question.optionPercentages = Array(question.options.length).fill(0);
  }
}
  
// Helper method for finding the option index
private findOptionIndex(optionId: any, apiQuestion: any): number {
  // Get the options array
  const options = apiQuestion.options || [];
  
  // Try to find by id
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    if ((option.id && option.id == optionId) || 
        (option.offered_answers_id && option.offered_answers_id == optionId)) {
      return i;
    }
  }
  
  // If not found and optionId is a number, it might be an index
  if (typeof optionId === 'number' && optionId >= 0 && optionId < options.length) {
    return optionId;
  }
  
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
      if (typeof answer === 'number') {
        totalScore += answer;
        count++;
      } else if (answer.scale_answer !== undefined) {
        totalScore += answer.scale_answer;
        count++;
      }
    }
  });
  
  if (count > 0) {
    const avgScore = totalScore / count;
    question.scaleValue = Math.round(avgScore);
    
    // Calculate percentage of max value
    const maxValue = apiQuestion.maxValue || apiQuestion.max_value || 5;
    question.answerPercentage = Math.round((avgScore / maxValue) * 100);
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
    if (result.answers && result.answers[questionId]) {
      const answer = result.answers[questionId];
      if (typeof answer === 'string' && answer.trim() !== '') {
        textAnswers.push(answer);
      } else if (answer.text_answer && answer.text_answer.trim() !== '') {
        textAnswers.push(answer.text_answer);
      }
    }
  });
  
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
        if (this.eventId && result) {
          // Prepare survey data for API
          const surveyData = {
            title: result.title || 'Neue Umfrage',
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
              if (response && response.success) {
                // Convert back to our model format
                const newSurvey = this.processSurveyData(response.data);
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
    if (this.surveyId) {
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
    } else {
      // Fallback to the mock service for frontend-only operation
      this.dataService.getSurveyResult(survey).subscribe({
        next: (resultSurvey: Survey) => {
          this.ongoingSurveys = this.ongoingSurveys.filter(s => s !== survey);
          this.completedSurveys.push(resultSurvey);
        },
        error: (err) => {
          console.error('Error completing survey:', err);
        }
      });
    }
  }
}