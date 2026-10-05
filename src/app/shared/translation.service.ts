import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  currentLang = signal('en');
  translations = signal<any>({});
  translationsLoaded = signal(false);
  private defaultTranslations: any = {};

  constructor(private http: HttpClient) {
    this.loadDefaultTranslations();
  }

  private loadDefaultTranslations() {
    this.http.get<any>(`./assets/i18n/en.json`).subscribe(
      (data) => {
        this.translations.set(data);
        this.defaultTranslations = data;
        this.currentLang.set('en');
        this.translationsLoaded.set(true);
        console.log('Default translations loaded:', data);
      },
      (error) => {
        console.error('Error loading default translations:', error);
      }
    );
  }

  loadTranslations(lang: string) {
    this.translationsLoaded.set(false);
    this.http.get<any>(`./assets/i18n/${lang}.json`).subscribe(
      (data) => {
        this.translations.set(data);
        this.currentLang.set(lang);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        this.translationsLoaded.set(true);
        console.log(`Translations loaded for ${lang}:`, data);
      },
      (error) => {
        console.error('Error loading translations:', error);
        this.translations.set(this.defaultTranslations);
        this.translationsLoaded.set(true);
      }
    );
  }

  translate(key: string): string {
    const keys = key.split('.');
    let value = this.translations();
    for (const k of keys) {
      value = value?.[k];
    }
    const result = value || key;
    return result;
  }

  switchLanguage(lang: string) {
    this.loadTranslations(lang);
  }
}
