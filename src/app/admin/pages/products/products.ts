import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '../../../shared/translate.pipe';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class ProductsComponent {
  products = [
    { id: 1, name: 'Potatoes', category: 'fresh', icon: '🥔', description: 'High-quality potatoes', price: 'Contact for pricing' },
    { id: 2, name: 'Tomatoes', category: 'fresh', icon: '🍅', description: 'Fresh tomatoes', price: 'Contact for pricing' },
    { id: 3, name: 'Cherry Tomatoes', category: 'fresh', icon: '🍅', description: 'Sweet cherry tomatoes', price: 'Contact for pricing' },
    { id: 4, name: 'White Onions', category: 'fresh', icon: '🧅', description: 'Premium white onions', price: 'Contact for pricing' },
    { id: 5, name: 'Red Onions', category: 'fresh', icon: '🧅', description: 'Vibrant red onions', price: 'Contact for pricing' },
    { id: 6, name: 'Roumi Eggplant', category: 'fresh', icon: '🍆', description: 'Egyptian eggplant', price: 'Contact for pricing' },
    { id: 7, name: 'Arousa Eggplant', category: 'fresh', icon: '🍆', description: 'Premium eggplant', price: 'Contact for pricing' },
    { id: 8, name: 'Green Chili', category: 'fresh', icon: '🌶️', description: 'Fresh green chilies', price: 'Contact for pricing' },
    { id: 9, name: 'Red Chili', category: 'fresh', icon: '🌶️', description: 'Spicy red chilies', price: 'Contact for pricing' },
    { id: 10, name: 'Colored Peppers', category: 'fresh', icon: '🫑', description: 'Colorful bell peppers', price: 'Contact for pricing' },
    { id: 11, name: 'Cucumbers', category: 'fresh', icon: '🥒', description: 'Fresh cucumbers', price: 'Contact for pricing' },
    { id: 12, name: 'Carrots', category: 'fresh', icon: '🥕', description: 'Sweet carrots', price: 'Contact for pricing' },
    { id: 13, name: 'Zucchini', category: 'fresh', icon: '🥒', description: 'Tender zucchini', price: 'Contact for pricing' },
    { id: 14, name: 'Kabocha Squash', category: 'fresh', icon: '🎃', description: 'Nutritious squash', price: 'Contact for pricing' },
    { id: 15, name: 'White Cabbage', category: 'fresh', icon: '🥬', description: 'Fresh white cabbage', price: 'Contact for pricing' },
    { id: 16, name: 'Red Cabbage', category: 'fresh', icon: '🥬', description: 'Vibrant red cabbage', price: 'Contact for pricing' },
    { id: 17, name: 'Mushrooms', category: 'fresh', icon: '🍄', description: 'Fresh mushrooms', price: 'Contact for pricing' },
    { id: 18, name: 'Leeks', category: 'fresh', icon: '🧅', description: 'Fresh leeks', price: 'Contact for pricing' },
    { id: 19, name: 'Arugula', category: 'aromatic', icon: '🌿', description: 'Fresh arugula', price: 'Contact for pricing' },
    { id: 20, name: 'Parsley', category: 'aromatic', icon: '🌿', description: 'Fresh parsley', price: 'Contact for pricing' },
    { id: 21, name: 'Coriander', category: 'aromatic', icon: '🌿', description: 'Aromatic coriander', price: 'Contact for pricing' },
    { id: 22, name: 'Dill', category: 'aromatic', icon: '🌿', description: 'Fresh dill', price: 'Contact for pricing' },
    { id: 23, name: 'Thyme', category: 'aromatic', icon: '🌱', description: 'Premium thyme', price: 'Contact for pricing' },
    { id: 24, name: 'Rosemary', category: 'aromatic', icon: '🌱', description: 'Aromatic rosemary', price: 'Contact for pricing' },
    { id: 25, name: 'Avocados', category: 'fresh', icon: '🥑', description: 'Creamy avocados', price: 'Contact for pricing' }
  ];

  constructor(private router: Router) {}

  editProduct(id: number) {
    this.router.navigate(['/admin/products', id, 'edit']);
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.products = this.products.filter(p => p.id !== id);
    }
  }

  addNewProduct() {
    this.router.navigate(['/admin/products/new']);
  }
}
