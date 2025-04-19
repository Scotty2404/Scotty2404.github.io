import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { DataService } from '../../services/data.service';
import { SurveyDialogComponent } from '../../components/survey-dialog-box/survey-dialog.component';
import { SurveyQuestionResultBoxComponent } from '../../components/survey-question-result-box/survey-question-result-box.component';
import { Survey } from '../../models/survey.model';
import { MatAccordion } from '@angular/material/expansion';


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
    MatAccordion
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './survey-page.component.html',
  styleUrls: ['./survey-page.component.scss']
})
export class SurveyPageComponent implements OnInit {
  completedSurveys: Survey[] = [
    {
      title: 'Product Satisfaction',
      questions: [
        {
          text: 'How satisfied are you with the product?',
          answerType: 'scale',
          answerPercentage: 75
        },
        {
          text: 'How is your day?',
          answerType: 'scale',
          answerPercentage: 50
        },
        {
          text: 'Which features do you use regularly?',
          answerType: 'checkbox',
          options: ['Search', 'Favorites', 'Notifications'],
          optionPercentages: [50, 40, 75]
        },
        {
          text: 'What would you improve?',
          answerType: 'open',
          answerField: ['make a playlist', 'no cake', 'no children']
        }
      ]
    },
    {
      title: 'Website Feedback',
      questions: [
        {
          text: 'How user-friendly is our website?',
          answerType: 'scale',
          answerPercentage: 60
        },
        {
          text: 'Which sections do you visit most?',
          answerType: 'checkbox',
          options: ['Home', 'Blog', 'Contact', 'Shop'],
          optionPercentages: [50, 43, 85, 71]
        },
        {
          text: 'Any suggestions for improvement?',
          answerType: 'open',
          answerField: ['answer1', 'answer2']
        }
      ]
    }
  ];

  draftSurveys: Survey[] = [];
  ongoingSurveys: Survey[] = [];

  constructor(private dataService: DataService, private dialog: MatDialog) {}
  panelOpenState = signal(false);

  ngOnInit(): void {
    // For now, don't load from backend
    // this.dataService.getSurveyList().subscribe((surveys: Survey[]) => {
    //   console.log('Surveys loaded:', surveys);
    //   this.ongoingSurveys = surveys; // Or split based on status
    // });

    console.log('Mocked survey data:', this.ongoingSurveys);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SurveyDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Assuming the new survey has a "status" field
        console.log('New survey created:', result);

        switch (result.status) {
          case 'ongoing':
            this.ongoingSurveys.push(result);
            break;
          case 'draft':
            this.draftSurveys.push(result);
            break;
          case 'completed':
            this.completedSurveys.push(result);
            break;
          default:
            this.ongoingSurveys.push(result);
        }
      }
    });
  }
}