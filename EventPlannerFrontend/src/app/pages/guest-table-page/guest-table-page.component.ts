import { Component, OnInit } from '@angular/core';
import { GuestTableBoxComponent } from '../../components/guest-table-box/guest-table-box.component';
import { MatDialog } from '@angular/material/dialog';
import { GuestTableDialogComponent } from '../../components/guest-table-dialog/guest-table-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { LoadingBoxComponent } from '../../components/loading-box/loading-box.component';
import { LoadingFailedBoxComponent } from '../../components/loading-failed-box/loading-failed-box.component';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'app-guest-table-page',
  imports: [GuestTableBoxComponent, GuestTableDialogComponent, MatButtonModule, RouterLink,MatIconModule, LoadingBoxComponent, LoadingFailedBoxComponent],
  templateUrl: './guest-table-page.component.html',
  styleUrl: './guest-table-page.component.scss'
})
export class GuestTablePageComponent implements OnInit{
  guests: any = [{
    guest_firstname: 'Noch keine Gäste im Event',
    guest_lastname: '',
    email: '',
    confirmation: 0,
    owner: 0,
    guest_info: '',
  }];
  eventId: any;
  isLoaded = false;
  isFailed = false;

  constructor(private apiService: ApiService, public dialog: MatDialog, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.loadGuests();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(GuestTableDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const transformResult = this.transformResult(result);
        console.log(result);
        console.log(transformResult);
        this.apiService.addGuestToEvent(transformResult, this.eventId).subscribe({
          next: (res) => {
            console.log('Guest added: ', res);
            this.loadGuests();
          }, error: (error) => {
            console.log('Adding Guest to Event Failed ', error);
            this.isFailed = true;
          }
        });
      }
    });
  }

  loadGuests(){
    this.apiService.getGuestsForEvent(this.eventId!).subscribe((data) => {
      console.log(data);
      if(data.length !== 0) {
        this.guests = data;
      }
      this.isLoaded = true;
    }, (error) => {
      console.error('Error fetching guests for Event', error);
      this.isFailed = true;
    });

  }

  transformResult(result: any) {
    return {
      type: 'extra',
      confirmation: result.confirmation === 'yes' ? 1 : 0,
      guest: {
        firstname: result.firstname,
        lastname: result.lastname,
      },
    };
  }
}
