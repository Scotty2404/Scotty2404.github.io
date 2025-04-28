// Importiert grundlegende Angular- und Material-Module
import { Component, Inject } from '@angular/core'; 
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatDialogModule } from '@angular/material/dialog'; 
import { CommonModule } from '@angular/common'; 

// Dekorator, der diese Klasse als Angular-Komponente definiert
@Component({
  selector: 'app-confirm-dialog', // Selektorname für die Komponente (wird aber meist durch MatDialog geöffnet)
  standalone: true,               // Standalone-Komponente (keine Deklaration in einem Modul nötig)
  templateUrl: './confirm-dialog.component.html', // Verweis auf die zugehörige HTML-Template-Datei
  imports: [                      // Eingebundene Module für diese Komponente
    MatDialogModule,               // Material Dialog-Funktionalität (öffnet und steuert Dialoge)
    MatButtonModule,               // Material Buttons für "Ja" und "Abbrechen"
    CommonModule                   // Basis-Features von Angular (ngIf, ngFor, etc.)
  ], 
})
export class ConfirmDialogComponent {

    // Konstruktor wird aufgerufen, wenn die Komponente instanziiert wird
    // 'dialogRef' ermöglicht die Steuerung des Dialogfensters (z.B. schließen)
    constructor(private dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

    // Diese Methode wird ausgeführt, wenn der Benutzer die Aktion bestätigt (z.B. "Ja" klickt)
    onConfirm(): void {
      this.dialogRef.close(true); 
      // Der Dialog wird geschlossen, und es wird der Wert "true" an den Aufrufer zurückgegeben
      // Der Aufrufer kann daraufhin z.B. die Aktion (Löschen, Speichern etc.) durchführen
    }

    // Diese Methode wird ausgeführt, wenn der Benutzer den Dialog abbricht (z.B. "Abbrechen" klickt)
    onCancel(): void {
      this.dialogRef.close(false); 
      // Der Dialog wird geschlossen, und "false" signalisiert dem Aufrufer, dass nichts passieren soll
    }
}