import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../shared/translate.pipe';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  registerForm = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(private router: Router) {}

  onSubmit() {
    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Register:', this.registerForm);
    alert('Registration functionality coming soon!');
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
