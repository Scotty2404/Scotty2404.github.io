import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-qr-survey-dialog',
  imports: [
    MatDialogModule,
    RouterLink,
    MatButton
  ],
  templateUrl: './qr-survey-dialog.component.html',
  styleUrl: './qr-survey-dialog.component.scss'
})
export class QrSurveyDialogComponent {

  
}
