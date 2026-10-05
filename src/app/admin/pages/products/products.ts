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
    { id: 1, name: 'Potatoes', category: 'fresh', description: 'High-quality potatoes', price: 'Contact for pricing' },
    { id: 2, name: 'Tomatoes', category: 'fresh', description: 'Fresh tomatoes', price: 'Contact for pricing' },
    { id: 3, name: 'Cherry Tomatoes', category: 'fresh', description: 'Sweet cherry tomatoes', price: 'Contact for pricing' },
    { id: 4, name: 'White Onions', category: 'fresh', description: 'Premium white onions', price: 'Contact for pricing' },
    { id: 5, name: 'Red Onions', category: 'fresh', description: 'Vibrant red onions', price: 'Contact for pricing' },
    { id: 6, name: 'Roumi Eggplant', category: 'fresh', description: 'Egyptian eggplant', price: 'Contact for pricing' },
    { id: 7, name: 'Arousa Eggplant', category: 'fresh', description: 'Premium eggplant', price: 'Contact for pricing' },
    { id: 8, name: 'Green Chili', category: 'fresh', description: 'Fresh green chilies', price: 'Contact for pricing' },
    { id: 9, name: 'Red Chili', category: 'fresh', description: 'Spicy red chilies', price: 'Contact for pricing' },
    { id: 10, name: 'Colored Peppers', category: 'fresh', description: 'Colorful bell peppers', price: 'Contact for pricing' },
    { id: 11, name: 'Cucumbers', category: 'fresh', description: 'Fresh cucumbers', price: 'Contact for pricing' },
    { id: 12, name: 'Carrots', category: 'fresh', description: 'Sweet carrots', price: 'Contact for pricing' },
    { id: 13, name: 'Zucchini', category: 'fresh', description: 'Tender zucchini', price: 'Contact for pricing' },
    { id: 14, name: 'Kabocha Squash', category: 'fresh', description: 'Nutritious squash', price: 'Contact for pricing' },
    { id: 15, name: 'White Cabbage', category: 'fresh', description: 'Fresh white cabbage', price: 'Contact for pricing' },
    { id: 16, name: 'Red Cabbage', category: 'fresh', description: 'Vibrant red cabbage', price: 'Contact for pricing' },
    { id: 17, name: 'Mushrooms', category: 'fresh', description: 'Fresh mushrooms', price: 'Contact for pricing' },
    { id: 18, name: 'Leeks', category: 'fresh', description: 'Fresh leeks', price: 'Contact for pricing' },
    { id: 19, name: 'Arugula', category: 'aromatic', description: 'Fresh arugula', price: 'Contact for pricing' },
    { id: 20, name: 'Parsley', category: 'aromatic', description: 'Fresh parsley', price: 'Contact for pricing' },
    { id: 21, name: 'Coriander', category: 'aromatic', description: 'Aromatic coriander', price: 'Contact for pricing' },
    { id: 22, name: 'Dill', category: 'aromatic', description: 'Fresh dill', price: 'Contact for pricing' },
    { id: 23, name: 'Thyme', category: 'aromatic', description: 'Premium thyme', price: 'Contact for pricing' },
    { id: 24, name: 'Rosemary', category: 'aromatic', description: 'Aromatic rosemary', price: 'Contact for pricing' },
    { id: 25, name: 'Avocados', category: 'fresh', description: 'Creamy avocados', price: 'Contact for pricing' }
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
