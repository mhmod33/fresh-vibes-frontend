import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../shared/translate.pipe';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
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

  onSubmit() {
    console.log('Form submitted:', this.contactForm);
    alert('Thank you for your message! We will get back to you soon.');
    this.contactForm = { name: '', email: '', subject: '', message: '' };
  }
}
