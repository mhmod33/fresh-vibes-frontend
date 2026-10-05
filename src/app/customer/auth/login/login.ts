import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../shared/translate.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginForm = {
    email: '',
    password: ''
  };

  constructor(private router: Router) {}

  onSubmit() {
    console.log('Login:', this.loginForm);
    alert('Login functionality coming soon!');
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
