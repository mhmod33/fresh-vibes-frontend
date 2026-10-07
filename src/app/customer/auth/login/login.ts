import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../shared/translate.pipe';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  loginForm = {
    email: '',
    password: ''
  };

  showPassword = false;
  isLoading = false;
  errorMessage = '';
  errorField = '';
  successMessage = '';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    // Check if user is already logged in
    const token = localStorage.getItem('authToken');
    if (token) {
      // Redirect to admin dashboard if already authenticated
      this.router.navigate(['/admin']);
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.errorMessage = '';
    this.errorField = '';
    this.successMessage = '';

    // Client-side validation
    if (!this.loginForm.email.trim()) {
      this.errorMessage = 'Email is required';
      this.errorField = 'email';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.loginForm.email)) {
      this.errorMessage = 'Please enter a valid email address';
      this.errorField = 'email';
      return;
    }

    if (!this.loginForm.password) {
      this.errorMessage = 'Password is required';
      this.errorField = 'password';
      return;
    }

    this.isLoading = true;

    // API call
    this.http.post<any>(`${environment.apiUrl}/login`, this.loginForm, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Login successful! Redirecting...';

        // Store token and user data
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }

        // Redirect after 1.5 seconds
        setTimeout(() => {
          this.router.navigate(['/admin']);
        }, 1500);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;

        if (error.error && error.error.errors) {
          // Handle validation errors from Laravel
          const errors = error.error.errors;
          const firstErrorField = Object.keys(errors)[0];
          this.errorField = firstErrorField;
          this.errorMessage = errors[firstErrorField][0];
        } else if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 401) {
          this.errorMessage = 'Invalid email or password';
        } else if (error.status === 0) {
          this.errorMessage = 'Unable to connect to server. Please check your internet connection.';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      }
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
