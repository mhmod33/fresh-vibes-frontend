import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../shared/translation.service';
import { TranslatePipe } from '../shared/translate.pipe';
import { AuthService } from '../services/auth.service';

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
    public authService: AuthService
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

  isAdmin(): boolean {
    return this.authService.isAuthenticated();
  }
}
