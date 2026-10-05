import { Component } from '@angular/core';
import { TranslatePipe } from '../../../shared/translate.pipe';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class AboutComponent {}
