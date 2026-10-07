import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslationService } from '../shared/translation.service';
import { TranslatePipe } from '../shared/translate.pipe';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, TranslatePipe, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  currentLang = 'en';

  constructor(
    private router: Router,
    private translationService: TranslationService,
    public authService: AuthService,
    private http: HttpClient
  ) {
    this.currentLang = this.translationService.currentLang();
  }

  switchLanguage(lang: string) {
    this.translationService.switchLanguage(lang);
    this.currentLang = lang;
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  logout() {
    const token = localStorage.getItem('authToken');

    if (token) {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      this.http.post(`${environment.apiUrl}/logout`, {}, { headers }).subscribe({
        next: () => {
          this.clearAuthData();
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Logout error:', error);
          // Clear local data even if API call fails
          this.clearAuthData();
          this.router.navigate(['/']);
        }
      });
    } else {
      this.clearAuthData();
      this.router.navigate(['/']);
    }
  }

  private clearAuthData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
}
