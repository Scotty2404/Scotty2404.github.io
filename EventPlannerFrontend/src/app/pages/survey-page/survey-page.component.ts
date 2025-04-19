import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { DataService } from '../../services/data.service';
import { SurveyDialogComponent } from '../../components/survey-dialog-box/survey-dialog.component';
import { SurveyQuestionBoxComponent } from '../../components/survey-question-box/survey-question-box.component';
import { Survey } from '../../models/survey.model';

@Component({
  selector: 'app-survey-page',
  standalone: true,
  imports: [
    RouterModule,
    MatButtonModule,
    MatIcon,
    SurveyQuestionBoxComponent
  ],
  templateUrl: './survey-page.component.html',
  styleUrls: ['./survey-page.component.scss']
})
export class SurveyPageComponent implements OnInit {
  surveys: Survey[] = [
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

  constructor(private dataService: DataService, public dialog: MatDialog) {}

  ngOnInit(): void {
    // vorübergehend NICHT das Backend nutzen:
    // this.dataService.getSurveyList().subscribe((surveys: Survey[]) => {
    //   console.log('Surveys loaded:', surveys);
    //   this.surveys = surveys;
    // });
  
    console.log('Mocked survey:', this.surveys);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SurveyDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.addSurvey(result);
        this.surveys.push(result);
      }
    });
  }
}