import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { NEVER, of, Subject, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from '../../../services/product.service';
import { ProductFormComponent } from './product-form';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  const productService = {
    getProduct: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn()
  };

  beforeEach(async () => {
    localStorage.setItem('authToken', 'test-token');
    productService.getProduct.mockReset();
    productService.getProduct.mockReturnValue(of({
      id: 2,
      name: 'Denim Jeans',
      category: 'Clothing',
      description: 'Stylish blue denim jeans with a modern slim fit. Durable and comfortable.',
      price: '79.99',
      stock: 50,
      image: null,
      is_active: true
    }));

    await TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '12' } } }
        },
        { provide: ProductService, useValue: productService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    localStorage.removeItem('authToken');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('populates edit fields from the product response', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.isEditMode).toBe(true);
    expect(component.productForm).toEqual({
      name: 'Denim Jeans',
      category: 'Clothing',
      description: 'Stylish blue denim jeans with a modern slim fit. Durable and comfortable.',
      price: 79.99,
      stock: 50,
      is_active: true
    });
    expect(component.categories[0]).toEqual({ id: 'Clothing', name: 'Clothing' });
    expect(component.imagePreview).toBeNull();
    expect(component.isLoading()).toBe(false);
    expect(component.isSaving).toBe(false);
    expect(fixture.nativeElement.querySelector('#name').value).toBe('Denim Jeans');
    expect(fixture.nativeElement.textContent).not.toContain('Loading product details...');
  });

  it('updates the edit form when product details arrive asynchronously', async () => {
    const productResponse = new Subject<any>();
    productService.getProduct.mockReturnValue(productResponse);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Loading product details...');

    productResponse.next({
      id: 2,
      name: 'Denim Jeans',
      description: 'Stylish blue denim jeans with a modern slim fit. Durable and comfortable.',
      price: '79.99',
      stock: 50,
      image: null,
      category: 'Clothing',
      is_active: true
    });

    await fixture.whenStable();
    fixture.detectChanges();

    expect(component.isLoading()).toBe(false);
    expect(fixture.nativeElement.querySelector('#name').value).toBe('Denim Jeans');
    expect(fixture.nativeElement.textContent).not.toContain('Loading product details...');
  });

  it('submits the edited fields when updating a product', () => {
    fixture.detectChanges();
    productService.updateProduct.mockReturnValue(of({}));
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    component.productForm.name = 'Updated Jeans';
    component.productForm.description = 'Updated description';
    component.productForm.price = 89.99;
    component.productForm.stock = 25;
    component.productForm.category = 'Clothing';
    component.selectedFile = new File(['image'], 'jeans.jpg', { type: 'image/jpeg' });

    component.onSubmit();

    const [productId, formData] = productService.updateProduct.mock.calls[0];
    expect(productId).toBe(12);
    expect(formData.get('name')).toBe('Updated Jeans');
    expect(formData.get('description')).toBe('Updated description');
    expect(formData.get('price')).toBe('89.99');
    expect(formData.get('stock')).toBe('25');
    expect(formData.get('category')).toBe('Clothing');
    expect((formData.get('image') as File).name).toBe('jeans.jpg');
    expect(formData.get('_method')).toBe('PUT');
  });

  it('clears the saving state and displays image validation errors', () => {
    fixture.detectChanges();
    productService.updateProduct.mockReturnValue(throwError(() => new HttpErrorResponse({
      status: 422,
      error: {
        message: 'The image field must not be greater than 2048 kilobytes.',
        errors: {
          image: ['The image field must not be greater than 2048 kilobytes.']
        }
      }
    })));

    component.onSubmit();
    fixture.detectChanges();

    expect(component.isSaving).toBe(false);
    expect(component.errorMessage).toBe('The image field must not be greater than 2048 kilobytes.');
    expect(fixture.nativeElement.textContent).not.toContain('Saving...');
  });

  it('does not show the saving state while product details are loading', () => {
    productService.getProduct.mockReturnValue(NEVER);

    fixture.detectChanges();

    expect(component.isLoading()).toBe(true);
    expect(component.isSaving).toBe(false);
    expect(fixture.nativeElement.textContent).not.toContain('Saving...');
    expect(fixture.nativeElement.textContent).toContain('Loading product details...');
  });

  it('previews a selected image on the add form', () => {
    fixture.destroy();
    const route = TestBed.inject(ActivatedRoute);
    vi.spyOn(route.snapshot.paramMap, 'get').mockReturnValue(null);
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:preview-image');
    const file = new File(['image'], 'new-product.png', { type: 'image/png' });
    const input = document.createElement('input');
    Object.defineProperty(input, 'files', { value: [file] });
    component.onFileSelected({ target: input } as unknown as Event);

    expect(component.selectedFile).toBe(file);
    expect(component.imagePreview).toBe('blob:preview-image');
  });

  it('sends the selected image file when creating a product', () => {
    fixture.destroy();
    const route = TestBed.inject(ActivatedRoute);
    vi.spyOn(route.snapshot.paramMap, 'get').mockReturnValue(null);
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    productService.createProduct.mockReturnValue(of({}));
    vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    component.selectedFile = new File(['image'], 'new-product.png', { type: 'image/png' });

    component.onSubmit();

    const [formData] = productService.createProduct.mock.calls[0];
    expect((formData.get('image') as File).name).toBe('new-product.png');
  });
});
