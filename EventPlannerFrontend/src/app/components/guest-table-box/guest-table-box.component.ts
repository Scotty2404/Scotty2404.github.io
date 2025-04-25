import { AfterViewInit, Component, ViewChild, Input } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatCard } from '@angular/material/card';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-guest-table-box',
  imports: [MatFormFieldModule, MatCard, MatInput, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, MatIcon, MatButtonModule, MatCardModule, MatIconModule, CommonModule, MatTooltip],
  templateUrl: './guest-table-box.component.html',
  styleUrl: './guest-table-box.component.scss'
})
export class GuestTableBoxComponent implements AfterViewInit {
  @Input() data: any[] = []; // Daten kommen von der Page-Component
  displayedColumns: string[] = ['firstname', 'lastname', 'mail', 'info', 'commitment', 'delete'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getCommitmentIcon(commitment: string): string {
    switch (commitment) {
      case 'yes': return 'assets/healthy.svg';
      case 'no': return 'assets/unhealthy.svg';
      default: return '';
    }
  }

  confirmDelete(row: any) {
    const confirmed = confirm(`Willst du ${row.firstname} ${row.lastname} wirklich von deinem Event ausladen?`);
    if (confirmed) {
      const index = this.dataSource.data.indexOf(row);
      if (index !== -1) {
        this.dataSource.data.splice(index, 1);
        this.dataSource.data = [...this.dataSource.data];
      }
    }
  }
  
  

  
}