import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { FooterComponent } from './footer/footer';
import { NavbarComponent } from './navbar/navbar';
import { ScrollToTopComponent } from './shared/scroll-to-top/scroll-to-top.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FooterComponent, NavbarComponent, ScrollToTopComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  constructor(private authService: AuthService) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
