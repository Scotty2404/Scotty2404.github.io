import { ComponentFixture, TestBed } from '@angular/core/testing';  
import { MatDialogRef } from '@angular/material/dialog';  
import { ConfirmDialogComponent } from './confirm-dialog.component';  

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;  // Deklariert eine Variable für die Komponente
  let fixture: ComponentFixture<ConfirmDialogComponent>;  // Deklariert eine Fixture-Variable für den Test

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmDialogComponent],  // Registriert die zu testende Komponente
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy() } }  // Stellt einen Mock für MatDialogRef bereit
      ]
    }).compileComponents();  // Kompiliert die Komponenten für den Test

    fixture = TestBed.createComponent(ConfirmDialogComponent);  // Erzeugt eine Instanz der Komponente
    component = fixture.componentInstance;  // Setzt die Komponente auf die Instanz der Fixture
    fixture.detectChanges();  // Erzeugt die notwendigen Änderungen im Test
  });

  // Test für den Konstruktor der Komponente
  it('should create', () => {
    expect(component).toBeTruthy();  // Überprüft, ob die Komponente erfolgreich erstellt wurde
  });

  // Test für die onConfirm Methode
  it('should close the dialog with true when onConfirm is called', () => {
    const dialogRef = fixture.debugElement.injector.get(MatDialogRef);  // Holt den MatDialogRef-Mock
    component.onConfirm();  // Ruft die onConfirm Methode auf
    expect(dialogRef.close).toHaveBeenCalledWith(true);  // Überprüft, ob die close-Methode mit true aufgerufen wurde
  });

  // Test für die onCancel Methode
  it('should close the dialog with false when onCancel is called', () => {
    const dialogRef = fixture.debugElement.injector.get(MatDialogRef);  // Holt den MatDialogRef-Mock
    component.onCancel();  // Ruft die onCancel Methode auf
    expect(dialogRef.close).toHaveBeenCalledWith(false);  // Überprüft, ob die close-Methode mit false aufgerufen wurde
  });
});