import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  isRegisterMode = false;
  user = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  };

  loginData = {
    email: '',
    password: '',
  };

  constructor(private apiService: ApiService, private router: Router) {}

  onLoginSubmit() {
    this.apiService.login(this.loginData).subscribe((response) => {
      console.log('Login successfull', response);
      localStorage.setItem('token', response.token);
      this.router.navigate(['/landing-page']);
    }, (error) => {
      console.log('Login failed', error);
    });
  }

  onRegisterSubmit() {
    this.apiService.register(this.user).subscribe((response) => {
      console.log('registration successfull', response);
      this.loginData.email = this.user.email;
      this.loginData.password = this.user.password;
      this.onLoginSubmit();
    }, (error) => {
      console.log('Registration failed', error);
    });
  }
}
