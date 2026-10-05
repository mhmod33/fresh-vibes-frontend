import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  currentLang = signal('en');
  translations = signal<any>({});

  constructor(private http: HttpClient) {
    this.loadTranslations('en');
  }

  loadTranslations(lang: string) {
    this.http.get(`./assets/i18n/${lang}.json`).subscribe(
      (data) => {
        this.translations.set(data);
        this.currentLang.set(lang);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      },
      (error) => {
        console.error('Error loading translations:', error);
      }
    );
  }

  translate(key: string): string {
    const keys = key.split('.');
    let value = this.translations();
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  }

  switchLanguage(lang: string) {
    this.loadTranslations(lang);
  }
}
