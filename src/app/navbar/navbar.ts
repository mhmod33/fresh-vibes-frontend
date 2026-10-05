import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { TranslationService } from '../shared/translation.service';
import { TranslatePipe } from '../shared/translate.pipe';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, TranslatePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  currentLang = 'en';

  constructor(
    private router: Router,
    private translationService: TranslationService
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
}
