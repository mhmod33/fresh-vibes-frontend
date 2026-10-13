import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NEVER, of } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { ProductsComponent } from './products';
import { environment } from '../../../../environments/environment';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  const productService = {
    getProducts: vi.fn(),
    deleteProduct: vi.fn()
  };

  beforeEach(async () => {
    localStorage.setItem('authToken', 'test-token');
    productService.getProducts.mockReset();
    productService.deleteProduct.mockReset();
    productService.getProducts.mockReturnValue(of({ data: [] }));
    productService.deleteProduct.mockReturnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        provideRouter([]),
        { provide: ProductService, useValue: productService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.removeItem('authToken');
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('stops loading and displays an error when the products request times out', async () => {
    productService.getProducts.mockReturnValue(NEVER);
    vi.useFakeTimers();

    fixture.detectChanges();
    expect(component.loading).toBe(true);

    await vi.advanceTimersByTimeAsync(10_000);

    expect(component.loading).toBe(false);
    expect(component.errorMessage).toBe('Loading products timed out. Please try again.');
    expect(fixture.nativeElement.textContent).toContain('Loading products timed out.');
    expect(fixture.nativeElement.textContent).not.toContain('Loading products...');
  });

  it('renders products after the request completes', () => {
    productService.getProducts.mockReturnValue(of({
      data: [{
        id: 1,
        name: 'Loaded product',
        description: 'Test',
        price: 10,
        stock: 5,
        image: null,
        category: 'fresh',
        is_active: true
      }]
    }));

    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Loaded product');
    expect(fixture.nativeElement.textContent).not.toContain('Loading products...');
  });

  it('requests and renders paginated product results', () => {
    productService.getProducts.mockReturnValue(of({
      data: [{
        id: 1,
        name: 'Page one product',
        description: 'Test',
        price: 10,
        stock: 5,
        image: null,
        category: 'fresh',
        is_active: true
      }],
      current_page: 1,
      last_page: 3,
      per_page: 12,
      total: 25
    }));

    fixture.detectChanges();

    expect(productService.getProducts).toHaveBeenCalledWith(1, 12);
    expect(component.totalProducts).toBe(25);
    expect(component.lastPage).toBe(3);
    expect(fixture.nativeElement.textContent).toContain('Showing 1–1 of 25 products');
    expect(fixture.nativeElement.querySelectorAll('.pagination-controls button')).toHaveLength(5);

    component.goToPage(2);

    expect(productService.getProducts).toHaveBeenLastCalledWith(2, 12);
  });

  it('renders the API-provided image URL for a product', () => {
    productService.getProducts.mockReturnValue(of({
      data: [{
        id: 3,
        name: 'Rosemary',
        description: 'Test',
        price: 10,
        stock: 5,
        image: 'products/rosemary.jpg',
        image_url: '/storage/products/rosemary.jpg',
        category: 'fresh',
        is_active: true
      }]
    }));

    fixture.detectChanges();

    const image = fixture.nativeElement.querySelector('.product-thumbnail') as HTMLImageElement;
    expect(image.getAttribute('src')).toBe(new URL('/storage/products/rosemary.jpg', environment.apiUrl).toString());
  });

  it('deletes a product after confirmation and shows success', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    productService.getProducts.mockReturnValue(of({
      data: [{
        id: 2,
        name: 'Product to delete',
        description: 'Test',
        price: 10,
        stock: 5,
        image: null,
        category: 'fresh',
        is_active: true
      }]
    }));
    fixture.detectChanges();

    component.deleteProduct(2);

    expect(productService.deleteProduct).toHaveBeenCalledWith(2);
    expect(component.products).toHaveLength(0);
    expect(component.successMessage).toBe('Product deleted successfully.');
    confirmSpy.mockRestore();
  });

  it('does not delete a product when confirmation is cancelled', () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.deleteProduct(2);

    expect(productService.deleteProduct).not.toHaveBeenCalled();
    confirmSpy.mockRestore();
  });
});
