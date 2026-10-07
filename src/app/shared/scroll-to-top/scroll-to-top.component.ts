import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="scroll-to-top"
      [class.visible]="isVisible"
      (click)="scrollToTop()"
      aria-label="Scroll to top">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path class="arrow-line" d="M12 19V5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path class="arrow-head" d="M5 12L12 5L19 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle class="progress-ring" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"
          [style.stroke-dashoffset]="strokeDashoffset"/>
      </svg>
      <div class="leaf-decoration">
        <svg viewBox="0 0 16 16" fill="none">
          <path d="M8 2C8 2 5 4 5 8C5 10 6.5 12 8 12C9.5 12 11 10 11 8C11 4 8 2 8 2Z" stroke="currentColor" stroke-width="1.2"/>
        </svg>
      </div>
    </button>
  `,
  styles: [`
    .scroll-to-top {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
      border: 2px solid rgba(112, 166, 91, 0.3);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px) scale(0.8);
      box-shadow:
        0 4px 16px rgba(22, 75, 58, 0.3),
        0 8px 32px rgba(22, 75, 58, 0.2);
      overflow: visible;
    }

    .scroll-to-top.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }

    .scroll-to-top svg {
      width: 24px;
      height: 24px;
      stroke: var(--white);
      position: relative;
      z-index: 2;
    }

    .progress-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 52px;
      height: 52px;
      stroke: var(--accent);
      stroke-dasharray: 62.83;
      stroke-dashoffset: 62.83;
      transform-origin: center;
      transition: stroke-dashoffset 0.1s linear;
      z-index: 1;
    }

    .arrow-line,
    .arrow-head {
      transition: all 0.3s ease;
    }

    .leaf-decoration {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 20px;
      height: 20px;
      background: var(--accent);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transform: scale(0.5);
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 2px 8px rgba(230, 164, 59, 0.4);
    }

    .leaf-decoration svg {
      width: 12px;
      height: 12px;
      stroke: var(--dark);
    }

    .scroll-to-top:hover {
      transform: translateY(-4px) scale(1.05);
      box-shadow:
        0 6px 20px rgba(22, 75, 58, 0.4),
        0 12px 40px rgba(22, 75, 58, 0.25),
        0 0 0 4px rgba(112, 166, 91, 0.2);
      border-color: var(--secondary);
    }

    .scroll-to-top:hover .leaf-decoration {
      opacity: 1;
      transform: scale(1) rotate(10deg);
    }

    .scroll-to-top:hover .arrow-line {
      transform: translateY(-2px);
    }

    .scroll-to-top:hover .arrow-head {
      transform: translateY(-2px);
      animation: arrowBounce 0.6s ease-in-out infinite;
    }

    @keyframes arrowBounce {
      0%, 100% {
        transform: translateY(-2px);
      }
      50% {
        transform: translateY(-6px);
      }
    }

    .scroll-to-top:active {
      transform: translateY(-2px) scale(1);
      box-shadow:
        0 2px 8px rgba(22, 75, 58, 0.3),
        0 4px 16px rgba(22, 75, 58, 0.2);
    }

    /* Pulse animation when first appearing */
    @keyframes buttonPulse {
      0% {
        box-shadow:
          0 4px 16px rgba(22, 75, 58, 0.3),
          0 8px 32px rgba(22, 75, 58, 0.2),
          0 0 0 0 rgba(112, 166, 91, 0.5);
      }
      50% {
        box-shadow:
          0 4px 16px rgba(22, 75, 58, 0.3),
          0 8px 32px rgba(22, 75, 58, 0.2),
          0 0 0 8px rgba(112, 166, 91, 0);
      }
      100% {
        box-shadow:
          0 4px 16px rgba(22, 75, 58, 0.3),
          0 8px 32px rgba(22, 75, 58, 0.2),
          0 0 0 0 rgba(112, 166, 91, 0);
      }
    }

    .scroll-to-top.visible {
      animation: buttonPulse 2s ease-out;
    }

    @media (max-width: 768px) {
      .scroll-to-top {
        width: 48px;
        height: 48px;
        bottom: 20px;
        right: 20px;
      }

      .scroll-to-top svg {
        width: 20px;
        height: 20px;
      }

      .progress-ring {
        width: 44px;
        height: 44px;
      }
    }
  `]
})
export class ScrollToTopComponent {
  isVisible = false;
  strokeDashoffset = 62.83; // Circumference of circle with r=10

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollPosition / windowHeight) * 100;

    // Show button after scrolling 300px
    this.isVisible = scrollPosition > 300;

    // Update progress ring
    this.strokeDashoffset = 62.83 - (62.83 * scrollPercentage / 100);
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
