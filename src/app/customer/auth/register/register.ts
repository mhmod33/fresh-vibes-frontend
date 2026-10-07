import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../shared/translate.pipe';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent implements OnInit {
  registerForm = {
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  };

  showPassword = false;
  showConfirmPassword = false;
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

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    this.errorMessage = '';
    this.errorField = '';
    this.successMessage = '';

    // Client-side validation
    if (!this.registerForm.name.trim()) {
      this.errorMessage = 'Name is required';
      this.errorField = 'name';
      return;
    }

    if (this.registerForm.name.length > 255) {
      this.errorMessage = 'Name must not exceed 255 characters';
      this.errorField = 'name';
      return;
    }

    if (!this.registerForm.email.trim()) {
      this.errorMessage = 'Email is required';
      this.errorField = 'email';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.registerForm.email)) {
      this.errorMessage = 'Please enter a valid email address';
      this.errorField = 'email';
      return;
    }

    if (!this.registerForm.password) {
      this.errorMessage = 'Password is required';
      this.errorField = 'password';
      return;
    }

    if (this.registerForm.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters';
      this.errorField = 'password';
      return;
    }

    if (this.registerForm.password !== this.registerForm.password_confirmation) {
      this.errorMessage = 'Passwords do not match';
      this.errorField = 'password_confirmation';
      return;
    }

    this.isLoading = true;

    // API call
    this.http.post<any>(`${environment.apiUrl}/register`, this.registerForm, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Registration successful! Redirecting to login...';

        // Store token if needed
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }

        // Redirect after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
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
        } else if (error.status === 0) {
          this.errorMessage = 'Unable to connect to server. Please check your internet connection.';
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      }
    });
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
