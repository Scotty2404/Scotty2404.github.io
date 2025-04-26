import { Component, Inject } from '@angular/core'; 
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { MatDialogModule } from '@angular/material/dialog'; 
import { MatButtonModule } from '@angular/material/button'; 

@Component({
  selector: 'app-error-dialog', // Der Selector, der den Dialog als benutzerdefinierte Komponente identifiziert
  templateUrl: './error-dialog.component.html', // Der Pfad zur HTML-Datei des Dialogs
  imports: [ 
    MatDialogModule, // Importiert die MatDialogModule, die notwendig ist, um den Dialog korrekt zu rendern
    MatButtonModule   // Importiert MatButtonModule für die Buttons im Dialog
  ],
  styleUrls: ['./error-dialog.component.scss'] // Pfad zur SCSS-Datei für das Styling
})
export class ErrorDialogComponent {
  // Der Konstruktor erhält die Dialogreferenz und die übergebenen Daten
  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>, // Referenz auf den Dialog, um ihn zu schließen
    @Inject(MAT_DIALOG_DATA) public data: { message: string } // Übernimmt die Daten (die Fehlermeldung)
  ) {}

  // Diese Methode wird aufgerufen, wenn der Benutzer auf den "OK"-Button klickt
  onClose(): void {
    // Schließt den Dialog
    this.dialogRef.close();
  }
}