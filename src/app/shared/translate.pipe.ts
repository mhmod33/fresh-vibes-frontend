import { Pipe, PipeTransform, inject, ChangeDetectorRef } from '@angular/core';
import { TranslationService } from './translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform {
  private translationService = inject(TranslationService);
  private cdr = inject(ChangeDetectorRef);
  private lastKey: string = '';
  private lastLang: string = '';
  private lastLoaded: boolean = false;

  transform(key: string): string {
    // Access signals to track changes
    const currentLang = this.translationService.currentLang();
    const loaded = this.translationService.translationsLoaded();
    
    // If language or loaded state changed, trigger change detection
    if (this.lastLang !== currentLang || this.lastKey !== key || this.lastLoaded !== loaded) {
      this.lastLang = currentLang;
      this.lastKey = key;
      this.lastLoaded = loaded;
      this.cdr.markForCheck();
    }

    return this.translationService.translate(key);
  }
}
