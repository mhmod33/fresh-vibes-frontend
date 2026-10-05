import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  currentLang = signal('en');
  translations = signal<any>({});
  private defaultTranslations: any = {};

  constructor(private http: HttpClient) {
    this.loadDefaultTranslations();
  }

  private loadDefaultTranslations() {
    this.http.get(`./assets/i18n/en.json`).subscribe(
      (data) => {
        this.translations.set(data);
        this.defaultTranslations = data;
        this.currentLang.set('en');
      },
      (error) => {
        console.error('Error loading default translations:', error);
      }
    );
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
        this.translations.set(this.defaultTranslations);
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
