import { ChangeDetectorRef, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../shared/translate.pipe';
import { ProductService } from '../../../services/product.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from '../../../models/product.model';
import { environment } from '../../../../environments/environment';
import { finalize, TimeoutError, timeout } from 'rxjs';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslatePipe],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css'
})
export class ProductFormComponent implements OnInit, OnDestroy {
  isEditMode = false;
  productId: number | null = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isLoading = signal(false);
  isSaving = false;
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
    { id: 'dry', name: 'Dry Crops' },
    { id: 'frozen', name: 'Frozen Crops' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Check authentication
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.productId = Number(id);
      this.loadProduct();
    }
  }

  ngOnDestroy() {
    this.revokeObjectUrlPreview();
  }

  loadProduct() {
    if (!this.productId) return;

    this.isLoading.set(true);
    this.errorMessage = '';

    this.productService.getProduct(this.productId).pipe(
      timeout({ first: 15_000 }),
      finalize(() => {
        this.isLoading.set(false);
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: (response: Product | { data: Product }) => {
        const product = 'data' in response ? response.data : response;
        const category = product.category || 'fresh';

        if (!this.categories.some(item => item.id === category)) {
          this.categories = [{ id: category, name: category }, ...this.categories];
        }

        this.productForm = {
          name: product.name,
          category,
          description: product.description,
          price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
          stock: product.stock,
          is_active: product.is_active
        };

        const image = product.image || product.image_url;
        if (image) {
          this.imagePreview = new URL(image, environment.apiUrl).toString();
        } else {
          this.imagePreview = null;
        }

        this.isLoading.set(false);
        this.cdr.detectChanges();
      },
      error: (error: HttpErrorResponse | TimeoutError) => {
        console.error('Error loading product:', error);

        if (error instanceof TimeoutError) {
          this.errorMessage = 'Loading product details timed out. Please try again.';
        } else if (error.status === 401 || (error.error && error.error.message === 'Unauthenticated.')) {
          this.errorMessage = 'Your session has expired. Please login again.';
          setTimeout(() => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            this.router.navigate(['/login']);
          }, 2000);
        } else if (error.status === 404) {
          this.errorMessage = 'Product not found';
        } else if (error.status === 0) {
          this.errorMessage = 'Network error. Please check your connection.';
        } else {
          this.errorMessage = error.error?.message || 'Failed to load product';
        }
        this.cdr.detectChanges();
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.errorMessage = 'Please select an image file';
      input.value = '';
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      this.errorMessage = 'Image size must be 20MB or less';
      input.value = '';
      return;
    }

    this.selectedFile = file;
    this.errorMessage = '';
    this.revokeObjectUrlPreview();
    this.imagePreview = URL.createObjectURL(file);
  }

  removeImage() {
    this.selectedFile = null;
    this.revokeObjectUrlPreview();
    this.imagePreview = null;
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit() {
    if (this.isLoading() || this.isSaving) return;

    this.isSaving = true;
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

    let saveRequest;
    if (this.isEditMode && this.productId) {
      formData.append('_method', 'PUT');
      saveRequest = this.productService.updateProduct(this.productId, formData);
    } else {
      saveRequest = this.productService.createProduct(formData);
    }

    saveRequest.pipe(
      finalize(() => {
        this.isSaving = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: () => this.router.navigate(['/admin/products']),
      error: (error: HttpErrorResponse) => {
        console.error('Error saving product:', error);

        if (error.status === 401 || error.error?.message === 'Unauthenticated.') {
          this.errorMessage = 'Your session has expired. Please login again.';
          setTimeout(() => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            this.router.navigate(['/login']);
          }, 2000);
        } else if (error.error?.errors) {
          this.errorMessage = Object.values(error.error.errors).flat().join(', ');
        } else {
          this.errorMessage = error.error?.message || 'Failed to save product';
        }
      }
    });
  }

  onCancel() {
    this.router.navigate(['/admin/products']);
  }

  private revokeObjectUrlPreview() {
    if (this.imagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(this.imagePreview);
    }
  }
}
