import { Component, OnInit } from '@angular/core';
import { GuestTableBoxComponent } from '../../components/guest-table-box/guest-table-box.component';
import { DataService } from '../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { GuestTableDialogComponent } from '../../components/guest-table-dialog/guest-table-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LoadingBoxComponent } from '../../components/loading-box/loading-box.component';
import { LoadingFailedBoxComponent } from '../../components/loading-failed-box/loading-failed-box.component';

@Component({
  selector: 'app-guest-table-page',
  imports: [GuestTableBoxComponent, GuestTableDialogComponent, MatButtonModule, RouterLink,MatIconModule, LoadingBoxComponent, LoadingFailedBoxComponent],
  templateUrl: './guest-table-page.component.html',
  styleUrl: './guest-table-page.component.scss'
})
export class GuestTablePageComponent implements OnInit{

  guests: any[] = [];
  isLoaded = true;
  isFailed = false;

  constructor(private dataService: DataService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.guests = this.dataService.getGuestList();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(GuestTableDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.addGuest(result);
        this.guests = [...this.dataService.getGuestList()];
      }
    });
  }
}
