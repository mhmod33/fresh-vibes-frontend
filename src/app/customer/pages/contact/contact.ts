import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../shared/translate.pipe';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, RouterLink],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class ContactComponent {
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  loading = false;
  successMessage = '';
  errorMessage = '';

  private apiUrl = environment.apiUrl + '/contact';

  constructor(private http: HttpClient) {}

  onSubmit() {
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.subject || !this.contactForm.message) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.http.post(this.apiUrl, this.contactForm).subscribe({
      next: (response) => {
        this.successMessage = 'Thank you for your message! We will get back to you soon.';
        this.contactForm = { name: '', email: '', subject: '', message: '' };
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to send message. Please try again.';
        console.error('Error submitting contact form:', error);
        this.loading = false;
      }
    });
  }
}
