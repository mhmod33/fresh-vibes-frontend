import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslatePipe } from '../../../shared/translate.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslatePipe, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  private observer?: IntersectionObserver;

  ngOnInit() {
    // Animate numbers when hero comes into view
    this.animateStats();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const animateNumber = (element: Element) => {
      const target = parseInt(element.getAttribute('data-target') || '0');
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const updateNumber = () => {
        current += increment;
        if (current < target) {
          element.textContent = Math.floor(current).toString();
          requestAnimationFrame(updateNumber);
        } else {
          element.textContent = target.toString();
        }
      };

      updateNumber();
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateNumber(entry.target);
          this.observer?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => this.observer?.observe(stat));
  }
}
