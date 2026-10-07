import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslatePipe } from '../../../shared/translate.pipe';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  adminName: string = '';
  adminEmail: string = '';

  constructor(
    private router: Router,
    private http: HttpClient
  ){}

  ngOnInit() {
    // Get user data from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.adminName = user.name || 'Admin';
      this.adminEmail = user.email || '';
    } else {
      // If no user data, redirect to login
      this.router.navigate(['/login']);
    }
  }

  logout() {
    const token = localStorage.getItem('authToken');

    if (token) {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      this.http.post(`${environment.apiUrl}/logout`, {}, { headers }).subscribe({
        next: () => {
          this.clearAuthData();
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Logout error:', error);
          // Clear local data even if API call fails
          this.clearAuthData();
          this.router.navigate(['/']);
        }
      });
    } else {
      this.clearAuthData();
      this.router.navigate(['/']);
    }
  }

  private clearAuthData() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
}
