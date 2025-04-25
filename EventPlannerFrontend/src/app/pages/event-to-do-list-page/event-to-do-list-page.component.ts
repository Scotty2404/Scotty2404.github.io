import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-event-to-do-list-page',
  standalone: true,
  imports: [RouterLink, RouterModule, RouterOutlet, MatButtonModule, MatCheckboxModule, MatInputModule, FormsModule, MatIconModule, MatFormFieldModule],
  templateUrl: './event-to-do-list-page.component.html',
  styleUrl: './event-to-do-list-page.component.scss'
})
export class EventToDoListPageComponent {
  isLoaded = true;
  isFailed = false;

  newTodo: string = ''; // <- neu hinzugefügt
  todos: { text: string; done: boolean }[] = [];

  addTodo() {
    if (this.newTodo.trim()) {
      this.todos.push({ text: this.newTodo.trim(), done: false });
      this.newTodo = '';
    }
  }

  deleteTodo(index: number) {
    this.todos.splice(index, 1);
  }
}
