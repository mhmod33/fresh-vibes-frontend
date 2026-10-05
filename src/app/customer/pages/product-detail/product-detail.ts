import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '../../../shared/translate.pipe';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css'
})
export class ProductDetailComponent {
  product: any = null;

  products = [
    { id: 1, name: 'Potatoes', category: 'fresh', icon: '🥔', description: 'High-quality potatoes sourced from the best farms in Egypt. Available in various sizes and grades to meet your specific requirements.', price: 'Contact for pricing' },
    { id: 2, name: 'Tomatoes', category: 'fresh', icon: '🍅', description: 'Fresh, ripe tomatoes perfect for culinary use. Carefully selected and graded for quality.', price: 'Contact for pricing' },
    { id: 3, name: 'Cherry Tomatoes', category: 'fresh', icon: '🍅', description: 'Sweet and flavorful cherry tomatoes, ideal for salads and gourmet dishes.', price: 'Contact for pricing' },
    { id: 4, name: 'White Onions', category: 'fresh', icon: '🧅', description: 'Premium white onions with excellent storage life and flavor profile.', price: 'Contact for pricing' },
    { id: 5, name: 'Red Onions', category: 'fresh', icon: '🧅', description: 'Vibrant red onions known for their mild, sweet flavor and striking color.', price: 'Contact for pricing' },
    { id: 6, name: 'Roumi Eggplant', category: 'fresh', icon: '🍆', description: 'Traditional Egyptian eggplant variety, perfect for local dishes.', price: 'Contact for pricing' },
    { id: 7, name: 'Arousa Eggplant', category: 'fresh', icon: '🍆', description: 'Premium eggplant variety with excellent texture and flavor.', price: 'Contact for pricing' },
    { id: 8, name: 'Green Chili', category: 'fresh', icon: '🌶️', description: 'Fresh green chilies with varying heat levels for different culinary needs.', price: 'Contact for pricing' },
    { id: 9, name: 'Red Chili', category: 'fresh', icon: '🌶️', description: 'Spicy red chilies perfect for adding heat and flavor to dishes.', price: 'Contact for pricing' },
    { id: 10, name: 'Colored Peppers', category: 'fresh', icon: '🫑', description: 'Colorful bell peppers in red, yellow, and green varieties.', price: 'Contact for pricing' },
    { id: 11, name: 'Cucumbers', category: 'fresh', icon: '🥒', description: 'Fresh, crisp cucumbers ideal for salads and fresh consumption.', price: 'Contact for pricing' },
    { id: 12, name: 'Carrots', category: 'fresh', icon: '🥕', description: 'Sweet, crunchy carrots available in various sizes.', price: 'Contact for pricing' },
    { id: 13, name: 'Zucchini', category: 'fresh', icon: '🥒', description: 'Tender zucchini perfect for cooking and grilling.', price: 'Contact for pricing' },
    { id: 14, name: 'Kabocha Squash', category: 'fresh', icon: '🎃', description: 'Nutritious kabocha squash with sweet, nutty flavor.', price: 'Contact for pricing' },
    { id: 15, name: 'White Cabbage', category: 'fresh', icon: '🥬', description: 'Fresh white cabbage with crisp leaves.', price: 'Contact for pricing' },
    { id: 16, name: 'Red Cabbage', category: 'fresh', icon: '🥬', description: 'Vibrant red cabbage, perfect for salads and cooking.', price: 'Contact for pricing' },
    { id: 17, name: 'Mushrooms', category: 'fresh', icon: '🍄', description: 'Fresh mushrooms cultivated under controlled conditions.', price: 'Contact for pricing' },
    { id: 18, name: 'Leeks', category: 'fresh', icon: '🧅', description: 'Fresh leeks with mild onion flavor.', price: 'Contact for pricing' },
    { id: 19, name: 'Arugula', category: 'aromatic', icon: '🌿', description: 'Fresh arugula with peppery flavor, perfect for salads.', price: 'Contact for pricing' },
    { id: 20, name: 'Parsley', category: 'aromatic', icon: '🌿', description: 'Fresh parsley herb for culinary and garnish purposes.', price: 'Contact for pricing' },
    { id: 21, name: 'Coriander', category: 'aromatic', icon: '🌿', description: 'Aromatic coriander leaves and seeds available.', price: 'Contact for pricing' },
    { id: 22, name: 'Dill', category: 'aromatic', icon: '🌿', description: 'Fresh dill with delicate aroma and flavor.', price: 'Contact for pricing' },
    { id: 23, name: 'Thyme', category: 'aromatic', icon: '🌱', description: 'Premium thyme for culinary and medicinal uses.', price: 'Contact for pricing' },
    { id: 24, name: 'Rosemary', category: 'aromatic', icon: '🌱', description: 'Aromatic rosemary for cooking and essential oil production.', price: 'Contact for pricing' },
    { id: 25, name: 'Avocados', category: 'fresh', icon: '🥑', description: 'Creamy avocados rich in nutrients and flavor.', price: 'Contact for pricing' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.products.find(p => p.id === id);
    if (!this.product) {
      this.router.navigate(['/products']);
    }
  }
}
