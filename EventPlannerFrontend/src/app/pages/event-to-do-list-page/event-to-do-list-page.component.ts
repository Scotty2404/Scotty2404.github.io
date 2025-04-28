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
import { CommonModule } from '@angular/common';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-event-to-do-list-page',
  standalone: true,
  imports: [RouterLink, RouterModule, RouterOutlet, MatButtonModule, MatCheckboxModule, MatInputModule, FormsModule, MatIconModule, MatFormFieldModule, CommonModule],
  templateUrl: './event-to-do-list-page.component.html',
  styleUrls: ['./event-to-do-list-page.component.scss']
})
export class EventToDoListPageComponent implements OnInit {
  isLoaded = true;
  isFailed = false;

  newTodo: string = '';
  todos: { text: string; done: boolean }[] = [];

  ngOnInit() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      this.todos = JSON.parse(savedTodos);
    }
  }

  addTodo() {
    if (this.newTodo.trim()) {
      this.todos = [...this.todos, { text: this.newTodo.trim(), done: false }];
      this.saveTodos();
      this.newTodo = '';
    }
  }

  deleteTodo(index: number) {
    this.todos.splice(index, 1);
    this.todos = [...this.todos];
    this.saveTodos();
  }

  saveTodos() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }
}