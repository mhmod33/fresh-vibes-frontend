import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../shared/translate.pipe';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductFormComponent {
  isEditMode = false;
  productId: number | null = null;

  productForm = {
    name: '',
    category: 'fresh',
    icon: '🥔',
    description: '',
    price: ''
  };

  categories = [
    { id: 'fresh', name: 'Fresh Produce' },
    { id: 'aromatic', name: 'Aromatic & Medicinal' },
    { id: 'dry', name: 'Dry Crops' }
  ];

  icons = ['🥔', '🍅', '🧅', '🍆', '🌶️', '🫑', '🥒', '🥕', '🎃', '🥬', '🍄', '🌿', '🌱', '🥑'];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = Number(id);
      this.loadProduct();
    }
  }

  loadProduct() {
    // In real app, this would fetch from API
    const products = [
      { id: 1, name: 'Potatoes', category: 'fresh', icon: '🥔', description: 'High-quality potatoes', price: 'Contact for pricing' }
    ];
    const product = products.find(p => p.id === this.productId);
    if (product) {
      this.productForm = { ...product };
    }
  }

  onSubmit() {
    console.log('Product form:', this.productForm);
    if (this.isEditMode) {
      alert('Product updated successfully!');
    } else {
      alert('Product created successfully!');
    }
    this.router.navigate(['/admin/products']);
  }

  onCancel() {
    this.router.navigate(['/admin/products']);
  }
}
