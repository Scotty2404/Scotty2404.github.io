import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.component.html',
  imports: [MatDialogModule, MatButtonModule, CommonModule],
})

export class ConfirmDialogComponent {

    constructor(private dialogRef: MatDialogRef<ConfirmDialogComponent>) {}
  
    // Wird aufgerufen, wenn der Benutzer auf "Ja" klickt
    onConfirm(): void {
      this.dialogRef.close(true);  // Dialog mit "true" schließen
    }
  
    // Wird aufgerufen, wenn der Benutzer auf "Abbrechen" klickt
    onCancel(): void {
      this.dialogRef.close(false);  // Dialog mit "false" schließen
    }
  }