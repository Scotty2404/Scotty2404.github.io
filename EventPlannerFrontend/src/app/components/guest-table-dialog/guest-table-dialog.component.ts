import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-guest-table-dialog',
  imports: [ MatDialogModule, MatButtonModule, FormsModule, MatSelectModule, MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './guest-table-dialog.component.html',
  styleUrl: './guest-table-dialog.component.scss'
})
export class GuestTableDialogComponent {
  guest = { firstname: '', lastname: '', mail: '', info: '', commitment: 'maybe' };

  constructor(
    public dialogRef: MatDialogRef<GuestTableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.guest);
  }
}
