import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../shared/translate.pipe';
import { HttpClient } from '@angular/common/http';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number | string;
  stock: number;
  category: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface PaginatedResponse {
  data: Product[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class ProductsComponent implements OnInit {
  selectedCategory = 'all';
  searchQuery = '';
  currentPage = 1;
  lastPage = 1;
  totalProducts = 0;
  perPage = 12;
  products: Product[] = [];
  loading = false;

  categories = [
    { id: 'all', name: 'products.categories.all' },
    { id: 'fresh', name: 'products.categories.fresh' },
    { id: 'aromatic', name: 'products.categories.aromatic' },
    { id: 'dry', name: 'products.categories.dry' }
  ];

  private apiUrl = 'http://localhost:8000/products';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.cdr.detectChanges();

    let url = `${this.apiUrl}?page=${this.currentPage}&per_page=${this.perPage}`;

    if (this.selectedCategory !== 'all') {
      url += `&category=${this.selectedCategory}`;
    }

    if (this.searchQuery.trim()) {
      url += `&search=${encodeURIComponent(this.searchQuery)}`;
    }

    this.http.get<PaginatedResponse>(url).subscribe({
      next: (response) => {
        this.products = response.data || [];
        this.currentPage = response.current_page || 1;
        this.lastPage = response.last_page || 1;
        this.totalProducts = response.total || 0;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.products = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.loadProducts();
  }

  onSearch() {
    this.currentPage = 1;
    this.loadProducts();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.lastPage) {
      this.currentPage = page;
      this.loadProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.lastPage, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case 'fresh': return '#4a7c59';
      case 'aromatic': return '#8bc34a';
      case 'dry': return '#ff8c00';
      default: return '#1a4d2e';
    }
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/vecteezy_ai-generated-fresh-healthy-vegetables-on-rustic-wooden_39620296.jpg';
  }
}
