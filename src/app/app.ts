import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar';
import { FooterComponent } from './footer/footer';
import { TranslationService } from './shared/translation.service';

@Component({
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  providers: [TranslationService],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('frontend-app');

  constructor(private translationService: TranslationService) {}
}
