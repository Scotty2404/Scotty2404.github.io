import { Component } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { MatFormField } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';

interface WishlistItem {
  name: string;
  link: string;
  checked: boolean;
}

@Component({
  selector: 'app-event-wishlist-page',
  standalone: true,
  templateUrl: './event-wishlist-page.component.html',
  styleUrls: ['./event-wishlist-page.component.scss'],
  imports: [MatCheckboxModule, FormsModule, MatButtonModule, RouterLink, RouterModule, RouterOutlet, MatFormField, MatExpansionModule]
})
export class EventWishlistPageComponent {
  isLoaded = true;
  isFailed = false;
  panelOpenState = false;
}
