import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../shared/translate.pipe';
import { ProductService } from '../../../services/product.service';

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
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isLoading = false;
  errorMessage = '';

  productForm = {
    name: '',
    category: 'fresh',
    description: '',
    price: 0,
    stock: 0,
    is_active: true
  };

  categories = [
    { id: 'fresh', name: 'Fresh Produce' },
    { id: 'aromatic', name: 'Aromatic & Medicinal' },
    { id: 'dry', name: 'Dry Crops' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = Number(id);
      this.loadProduct();
    }
  }

  loadProduct() {
    if (!this.productId) return;

    this.isLoading = true;
    this.productService.getProduct(this.productId).subscribe({
      next: (product) => {
        this.productForm = {
          name: product.name,
          category: product.category || 'fresh',
          description: product.description,
          price: product.price,
          stock: product.stock,
          is_active: product.is_active
        };
        if (product.image_url) {
          this.imagePreview = product.image_url;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading product:', err);
        this.errorMessage = 'Failed to load product';
        this.isLoading = false;
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Please select an image file';
        return;
      }

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        this.errorMessage = 'Image size must be less than 2MB';
        return;
      }

      this.selectedFile = file;
      this.errorMessage = '';

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('name', this.productForm.name);
    formData.append('description', this.productForm.description);
    formData.append('price', this.productForm.price.toString());
    formData.append('stock', this.productForm.stock.toString());
    formData.append('category', this.productForm.category);
    formData.append('is_active', this.productForm.is_active ? '1' : '0');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEditMode && this.productId) {
      this.productService.updateProduct(this.productId, formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          console.error('Error updating product:', err);
          this.errorMessage = 'Failed to update product';
          this.isLoading = false;
        }
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          console.error('Error creating product:', err);
          this.errorMessage = 'Failed to create product';
          this.isLoading = false;
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/admin/products']);
  }
}
