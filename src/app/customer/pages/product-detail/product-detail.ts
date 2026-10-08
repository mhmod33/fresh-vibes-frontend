import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from "../../../../environments/environment";
interface Product {
  id: number;
  name: string;
  description: string;
  price: number | string;
  stock: number;
  image?: string | null;
  image_url?: string | null;
  category: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  quantity = 1;
  selectedImage = 0;

  private apiUrl = environment.apiUrl + '/products';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProductDetail(+productId);
    } else {
      this.router.navigate(['/products']);
    }
  }

  loadProductDetail(id: number) {
    this.loading = true;
    this.cdr.detectChanges();

    this.http.get<Product>(`${this.apiUrl}/${id}`).subscribe({
      next: (product) => {
        console.log('Product loaded:', product);
        this.product = product;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  increaseQuantity() {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (this.product) {
      alert(`Added ${this.quantity} ${this.product.name} to cart!`);
    }
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case 'fresh': return '#4a7c59';
      case 'aromatic': return '#8bc34a';
      case 'dry': return '#ff8c00';
      default: return '#1a4d2e';
    }
  }

  productImageUrl(product: Product): string {
    const image = product.image_url || product.image;
    return image
      ? new URL(image, environment.apiUrl).toString()
      : '/assets/vecteezy_ai-generated-fresh-healthy-vegetables-on-rustic-wooden_39620296.jpg';
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/vecteezy_ai-generated-fresh-healthy-vegetables-on-rustic-wooden_39620296.jpg';
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}
