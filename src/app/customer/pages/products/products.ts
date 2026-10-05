import { Component } from '@angular/core';
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
  selectedCategory = 'all';
  categories = [
    { id: 'all', name: 'products.categories.all' },
    { id: 'fresh', name: 'products.categories.fresh' },
    { id: 'aromatic', name: 'products.categories.aromatic' },
    { id: 'dry', name: 'products.categories.dry' }
  ];

  products = [
    { id: 1, name: 'Potatoes', category: 'fresh', icon: '🥔', color: 'green' },
    { id: 2, name: 'Tomatoes', category: 'fresh', icon: '🍅', color: 'green' },
    { id: 3, name: 'Cherry Tomatoes', category: 'fresh', icon: '🍅', color: 'green' },
    { id: 4, name: 'White Onions', category: 'fresh', icon: '🧅', color: 'green' },
    { id: 5, name: 'Red Onions', category: 'fresh', icon: '🧅', color: 'green' },
    { id: 6, name: 'Roumi Eggplant', category: 'fresh', icon: '🍆', color: 'green' },
    { id: 7, name: 'Arousa Eggplant', category: 'fresh', icon: '🍆', color: 'green' },
    { id: 8, name: 'Green Chili', category: 'fresh', icon: '🌶️', color: 'green' },
    { id: 9, name: 'Red Chili', category: 'fresh', icon: '🌶️', color: 'green' },
    { id: 10, name: 'Colored Peppers', category: 'fresh', icon: '🫑', color: 'green' },
    { id: 11, name: 'Cucumbers', category: 'fresh', icon: '🥒', color: 'green' },
    { id: 12, name: 'Carrots', category: 'fresh', icon: '🥕', color: 'green' },
    { id: 13, name: 'Zucchini', category: 'fresh', icon: '🥒', color: 'green' },
    { id: 14, name: 'Kabocha Squash', category: 'fresh', icon: '🎃', color: 'green' },
    { id: 15, name: 'White Cabbage', category: 'fresh', icon: '🥬', color: 'green' },
    { id: 16, name: 'Red Cabbage', category: 'fresh', icon: '🥬', color: 'green' },
    { id: 17, name: 'Mushrooms', category: 'fresh', icon: '🍄', color: 'green' },
    { id: 18, name: 'Leeks', category: 'fresh', icon: '🧅', color: 'green' },
    { id: 19, name: 'Arugula', category: 'aromatic', icon: '🌿', color: 'light-green' },
    { id: 20, name: 'Parsley', category: 'aromatic', icon: '🌿', color: 'light-green' },
    { id: 21, name: 'Coriander', category: 'aromatic', icon: '🌿', color: 'light-green' },
    { id: 22, name: 'Dill', category: 'aromatic', icon: '🌿', color: 'light-green' },
    { id: 23, name: 'Thyme', category: 'aromatic', icon: '🌱', color: 'light-green' },
    { id: 24, name: 'Rosemary', category: 'aromatic', icon: '🌱', color: 'light-green' },
    { id: 25, name: 'Avocados', category: 'fresh', icon: '🥑', color: 'orange' }
  ];

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  get filteredProducts() {
    if (this.selectedCategory === 'all') {
      return this.products;
    }
    return this.products.filter(p => p.category === this.selectedCategory);
  }

  getCategoryColor(category: string): string {
    switch (category) {
      case 'fresh': return '#4a7c59';
      case 'aromatic': return '#8bc34a';
      case 'dry': return '#ff8c00';
      default: return '#1a4d2e';
    }
  }
}
